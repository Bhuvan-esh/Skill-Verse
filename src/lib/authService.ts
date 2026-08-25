import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserDoc {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  authProvider: "google" | "apple" | "password";
  role: "visual_architect" | "community_ambassador" | "mentor" | "participant" | null;
  status: "pending_role" | "pending_approval" | "approved";
  emailOptOut: boolean;
  agreedToTerms: true;
  createdAt: Timestamp;
  approvedAt: Timestamp | null;
  approvedBy: string | null;
}

const AUTO_APPROVED_ROLES = ["visual_architect"];

function userRef(uid: string) {
  return doc(db, "users", uid);
}

function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firestore operation timed out')), ms)),
  ]);
}

// ---------- OAuth (Google / Apple) ----------
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return handleOAuthResult(result.user, "google");
}

export async function signInWithApple() {
  const provider = new OAuthProvider("apple.com");
  const result = await signInWithPopup(auth, provider);
  return handleOAuthResult(result.user, "apple");
}

async function handleOAuthResult(user: User, provider: "google" | "apple") {
  const [firstName, ...rest] = (user.displayName || "").split(" ");
  const userEmail = (user.email || "").toLowerCase();
  const lastName = rest.join(" ");

  const isDefaultArchitect = ["anushabhat2762@gmail.com", "bhuvanj06@gmail.com"].includes(userEmail);
  const initialRole = isDefaultArchitect ? "visual_architect" : null;
  const initialStatus = isDefaultArchitect ? "approved" : "pending_role";

  try {
    const ref = userRef(user.uid);
    const snap = await withTimeout(getDoc(ref), 1500);

    if (!snap.exists()) {
      withTimeout(
        setDoc(ref, {
          uid: user.uid,
          firstName: firstName || "Anusha",
          lastName: lastName || "Bhat",
          email: userEmail,
          authProvider: provider,
          role: initialRole,
          status: initialStatus,
          emailOptOut: false,
          agreedToTerms: true,
          createdAt: serverTimestamp(),
          approvedAt: isDefaultArchitect ? serverTimestamp() : null,
          approvedBy: isDefaultArchitect ? "system" : null,
        }),
        1500
      ).catch(() => {});
      return {
        uid: user.uid,
        status: initialStatus as UserDoc["status"],
        email: userEmail,
        firstName: firstName || "Anusha",
        lastName: lastName || "Bhat",
        role: initialRole,
      };
    }

    const data = snap.data();
    // Ensure default architect always maintains visual_architect approved status
    if (isDefaultArchitect && (data?.status !== "approved" || data?.role !== "visual_architect")) {
      await updateDoc(ref, {
        role: "visual_architect",
        status: "approved",
        approvedAt: serverTimestamp(),
      });
      return {
        uid: user.uid,
        status: "approved" as const,
        email: userEmail,
        firstName: data?.firstName || firstName || "Anusha",
        lastName: data?.lastName || lastName || "Bhat",
        role: "visual_architect" as const,
      };
    }

    return {
      uid: user.uid,
      status: (data?.status || "pending_role") as UserDoc["status"],
      email: userEmail,
      firstName: data?.firstName || firstName,
      lastName: data?.lastName || lastName,
      role: data?.role || null,
    };
  } catch (err) {
    console.warn("Firestore error during OAuth handling, proceeding with default profile:", err);
    return {
      uid: user.uid,
      status: isDefaultArchitect ? ("approved" as const) : ("pending_role" as const),
      email: userEmail,
      firstName: firstName || "Anusha",
      lastName: lastName || "Bhat",
      role: isDefaultArchitect ? "visual_architect" : null,
    };
  }
}


// ---------- Manual email/password signup ----------
export async function signUpWithEmail(params: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "visual_architect" | "community_ambassador" | "mentor" | "participant";
  emailOptOut: boolean;
}) {
  const cred = await createUserWithEmailAndPassword(
    auth,
    params.email,
    params.password
  );

  const isDefaultArchitect = ["anushabhat2762@gmail.com", "bhuvanj06@gmail.com"].includes(params.email.toLowerCase());
  const finalRole = isDefaultArchitect ? "visual_architect" : params.role;

  const status = (AUTO_APPROVED_ROLES.includes(finalRole) || isDefaultArchitect)
    ? "approved"
    : "pending_approval";

  await setDoc(userRef(cred.user.uid), {
    uid: cred.user.uid,
    firstName: params.firstName || "Anusha",
    lastName: params.lastName || "Bhat",
    email: params.email,
    authProvider: "password",
    role: finalRole,
    status,
    emailOptOut: params.emailOptOut,
    agreedToTerms: true,
    createdAt: serverTimestamp(),
    approvedAt: status === "approved" ? serverTimestamp() : null,
    approvedBy: isDefaultArchitect ? "system" : null,
  });

  return { uid: cred.user.uid, status };
}

// ---------- Login (returning users) ----------
export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const isDefaultArchitect = ["anushabhat2762@gmail.com", "bhuvanj06@gmail.com"].includes(email.toLowerCase());
  const snap = await getDoc(userRef(cred.user.uid));
  const currentStatus = snap.data()?.status as UserDoc["status"];
  return {
    uid: cred.user.uid,
    status: isDefaultArchitect ? "approved" : (currentStatus || "approved"),
  };
}


// ---------- Select Your Role page (Google/Apple users only) ----------
export async function chooseRole(
  uid: string,
  role: "visual_architect" | "community_ambassador" | "mentor" | "participant"
) {
  const status = AUTO_APPROVED_ROLES.includes(role) ? "approved" : "pending_approval";
  try {
    await withTimeout(
      setDoc(
        userRef(uid),
        {
          role,
          status,
          approvedAt: status === "approved" ? serverTimestamp() : null,
        },
        { merge: true }
      ),
      1500
    );
  } catch (err) {
    console.warn("Firestore error during chooseRole, proceeding with status:", err);
  }
  return status;
}

// ---------- Live listener for the Pending Approval page ----------
export function listenToOwnStatus(
  uid: string,
  onChange: (status: UserDoc["status"]) => void
) {
  return onSnapshot(userRef(uid), (snap) => {
    if (snap.exists()) onChange(snap.data().status as UserDoc["status"]);
  });
}

// ---------- Visual Architect: pending queue + notifications ----------
export function listenToPendingApprovals(
  onChange: (pending: UserDoc[]) => void
) {
  const q = query(collection(db, "users"), where("status", "==", "pending_approval"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => d.data() as UserDoc));
  });
}

export async function approveUser(targetUid: string, approverUid: string) {
  await updateDoc(userRef(targetUid), {
    status: "approved",
    approvedAt: serverTimestamp(),
    approvedBy: approverUid,
  });
}

export async function logOut() {
  await signOut(auth);
}
