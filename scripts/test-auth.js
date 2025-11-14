(async () => {
  try {
    const base = "http://localhost:3000";
    const timestamp = Date.now();
    const signupBody = {
      nome: `CLI Test ${timestamp}`,
      email: `cli-test+${timestamp}@example.com`,
      senha: "Test12345!",
      ra: `RA${timestamp}`,
    };

    console.log("Sending SIGNUP request with:", signupBody);
    const signupRes = await fetch(`${base}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupBody),
    });
    const signupText = await signupRes.text();
    console.log("SIGNUP STATUS:", signupRes.status);
    console.log("SIGNUP BODY:", signupText);

    console.log("Sending LOGIN request with:", {
      email: signupBody.email,
      senha: signupBody.senha,
    });
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupBody.email,
        senha: signupBody.senha,
      }),
    });
    const loginText = await loginRes.text();
    console.log("LOGIN STATUS:", loginRes.status);
    console.log("LOGIN BODY:", loginText);
  } catch (err) {
    console.error("Test script error:", err);
  }
})();
