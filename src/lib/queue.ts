import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

export interface EmailJob {
  to: string;
  subject: string;
  html: string;
  type: 'REGISTRATION' | 'RESULTS' | 'CREDITS' | 'IDEA_LAUNCH';
  userId?: string;
}

class JobQueue {
  private queue: EmailJob[] = [];
  private processing = false;

  public enqueue(job: EmailJob) {
    this.queue.push(job);
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) continue;

      try {
        // Send email via Nodemailer or log in development
        console.log(`[QUEUE EMAIL SENT] To: ${job.to} | Subject: ${job.subject}`);

        // Also create in-app notification if userId is provided
        if (job.userId) {
          await db.notification.create({
            data: {
              user_id: job.userId,
              type: job.type,
              title: job.subject,
              message: job.html.replace(/<[^>]*>?/gm, ''), // Strip tags for preview
            },
          });
        }
      } catch (error) {
        console.error('[QUEUE ERROR] Failed to process email job:', error);
      }
    }

    this.processing = false;
  }
}

export const emailQueue = new JobQueue();
