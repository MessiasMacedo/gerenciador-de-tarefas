package conn.Service;

import conn.Model.Usuario;

public record LoginResponse(String token, Usuario usuario){
}
