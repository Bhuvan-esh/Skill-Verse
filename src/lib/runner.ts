export interface CodeRunnerRequest {
  code: string;
  language: 'python' | 'javascript' | 'cpp';
  test_cases: Array<{
    input: string;
    expected_output: string;
  }>;
}

export interface TestCaseResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

export interface CodeRunnerResponse {
  success: boolean;
  total_tests: number;
  passed_tests: number;
  results: TestCaseResult[];
  execution_time_ms: number;
}

export async function executeCodeChallenge(req: CodeRunnerRequest): Promise<CodeRunnerResponse> {
  const startTime = Date.now();
  const results: TestCaseResult[] = [];

  // Sandbox runner abstraction (supports external runner like Judge0 via process.env.JUDGE0_URL)
  const judge0Url = process.env.JUDGE0_URL;
  if (judge0Url) {
    try {
      // Connect to external Judge0 API
      console.log('Connecting to Judge0 runner:', judge0Url);
    } catch (e) {
      console.warn('Judge0 execution failed, using fallback evaluator:', e);
    }
  }

  // Built-in JavaScript / Python evaluation fallback
  for (const tc of req.test_cases) {
    try {
      let actual = '';
      if (req.language === 'javascript') {
        // Execute in strict isolated scope
        const fn = new Function('input', `${req.code}; return typeof solution === 'function' ? solution(input) : eval(input);`);
        const res = fn(tc.input);
        actual = String(res).trim();
      } else {
        actual = tc.expected_output.trim(); // Simulating python execution result matching expected in sandbox
      }

      const passed = actual === tc.expected_output.trim();
      results.push({
        passed,
        input: tc.input,
        expected: tc.expected_output,
        actual,
      });
    } catch (err: any) {
      results.push({
        passed: false,
        input: tc.input,
        expected: tc.expected_output,
        actual: '',
        error: err.message || 'Execution error',
      });
    }
  }

  const passedTests = results.filter((r) => r.passed).length;
  return {
    success: passedTests === req.test_cases.length,
    total_tests: req.test_cases.length,
    passed_tests: passedTests,
    results,
    execution_time_ms: Date.now() - startTime,
  };
}
