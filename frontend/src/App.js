import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8800/passwords"; // URL da sua API

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar login
  const [passwords, setPasswords] = useState([]);
  const [formData, setFormData] = useState({ passname: "", password: "" });
  const [editData, setEditData] = useState({ id: null, passname: "", password: "" }); // Estado para edição
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [loginData, setLoginData] = useState({ username: "", password: "" }); // Dados de login

  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    }
  }, [isAuthenticated]);

  const fetchPasswords = async () => {
    try {
      const response = await axios.get(API_URL);
      setPasswords(response.data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Login simulado (substitua com autenticação real se necessário)
    const validUsername = "admin";
    const validPassword = "123";

    if (
      loginData.username === validUsername &&
      loginData.password === validPassword
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: "", password: "" });
  };

  const addPassword = async (e) => {
    e.preventDefault();
    if (!formData.passname || !formData.password) {
      alert("Preencha todos os campos!");
      return;
    }
    try {
      await axios.post(API_URL, formData);
      setFormData({ passname: "", password: "" });
      fetchPasswords();
    } catch (error) {
      console.error("Erro ao adicionar senha:", error);
    }
  };

  const deletePassword = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPasswords();
    } catch (error) {
      console.error("Erro ao deletar senha:", error);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPasswords = passwords.filter((item) =>
    item.passname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSecurePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const length = 12;
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const updatePassword = async (id) => {
    const newPassword = generateSecurePassword();
    try {
      await axios.put(`${API_URL}/${id}`, {
        passname: passwords.find((p) => p.id === id).passname,
        password: newPassword,
      });
      fetchPasswords();
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  };

  const copyToClipboard = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      alert("Senha copiada para a área de transferência!");
    });
  };

  // Função para iniciar a edição da senha
  const editPassword = (id) => {
    const passwordToEdit = passwords.find((p) => p.id === id);
    setEditData({ id, passname: passwordToEdit.passname, password: passwordToEdit.password });
  };

  // Função para salvar a senha editada
  const saveEditPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editData.id}`, {
        passname: editData.passname,
        password: editData.password,
      });
      fetchPasswords();
      setEditData({ id: null, passname: "", password: "" }); // Limpar o estado de edição
    } catch (error) {
      console.error("Erro ao editar senha:", error);
    }
  };

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tela principal após login
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Enigma Manager</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <form onSubmit={addPassword} className="mb-4">
        <div className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Password name"
              value={formData.passname}
              onChange={(e) =>
                setFormData({ ...formData, passname: e.target.value })
              }
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Add
            </button>
          </div>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPasswords.map((item) => (
            <tr key={item.id}>
              <td>{item.passname}</td>
              <td>
                {showPassword[item.id]
                  ? item.password
                  : "*".repeat(item.password.length)}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => togglePasswordVisibility(item.id)}
                  >
                    {showPassword[item.id] ? "Hide" : "Show"}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => updatePassword(item.id)}
                  >
                    Generate
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => copyToClipboard(item.password)}
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => editPassword(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePassword(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal ou formulário de edição */}
      {editData.id && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditData({ id: null, passname: "", password: "" })}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={saveEditPassword}>
                  <div className="mb-3">
                    <label className="form-label">Password Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.passname}
                      onChange={(e) =>
                        setEditData({ ...editData, passname: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.password}
                      onChange={(e) =>
                        setEditData({ ...editData, password: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
