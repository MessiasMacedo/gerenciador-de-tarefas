package conn.Controller;

import conn.Model.Usuario;

public record TokenResponse(String token, Usuario usuario) {
}
