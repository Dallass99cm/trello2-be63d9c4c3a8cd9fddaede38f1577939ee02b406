const API_BASE_URL = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard";
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("error-message");
const themeToggle = document.getElementById("theme-toggle");

// Carregar tema salvo
const savedTheme = localStorage.getItem("theme") || "light-theme";
document.body.classList.add(savedTheme);
updateThemeToggle(savedTheme === "dark-theme");

// Toggle de tema
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-theme");
  document.body.classList.remove(isDark ? "dark-theme" : "light-theme");
  document.body.classList.add(isDark ? "light-theme" : "dark-theme");
  localStorage.setItem("theme", isDark ? "light-theme" : "dark-theme");
  updateThemeToggle(!isDark);
});

// Função para atualizar ícone do toggle
function updateThemeToggle(isDark) {
  themeToggle.textContent = isDark ? "☀️" : "🌙";
}

// Validação do email
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Mostrar erro
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  emailInput.classList.add("error");
}

// Limpar erro
function clearError() {
  errorMessage.classList.add("hidden");
  emailInput.classList.remove("error");
}

// Handler do formulário
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const email = emailInput.value.trim();
  if (!validateEmail(email)) {
    showError("Por favor, informe um email válido.");
    return;
  }

  const submitButton = loginForm.querySelector("button");
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  try {
    const response = await fetch(
      `${API_BASE_URL}/People?Email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error(response.status === 404 
        ? "Email não encontrado." 
        : "Erro ao validar o email."
      );
    }

    const users = await response.json();
    const user = users.find(u => u.Email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    localStorage.setItem("user", JSON.stringify({ 
      id: user.Id, 
      email: user.Email 
    }));
    
    window.location.href = "telainicial.html";
    document.querySelector(".login-form").classList.add("hidden");
  } catch (error) {
    showError(error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Acessar";
  }
});

// Limpar erro ao digitar
emailInput.addEventListener("input", clearError);