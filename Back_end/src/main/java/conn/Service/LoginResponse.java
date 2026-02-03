package conn.Service;

import conn.Model.Usuario;

public class LoginResponse {
    public Long id;
    public String nome;
    public String email;

    public LoginResponse(Usuario u) {
        this.id = u.getId();
        this.nome = u.getNome();
        this.email = u.getEmail();
    }
}
