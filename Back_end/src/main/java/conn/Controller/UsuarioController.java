package conn.Controller;


import conn.Model.Usuario;
import conn.Repository.UsuarioRepository;
import conn.Service.LoginRequest;
import conn.Service.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/Usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {
        private final UsuarioRepository repo;

        public UsuarioController(UsuarioRepository repo) {
            this.repo = repo;
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody Usuario usuario) {

            if (repo.findByEmail(usuario.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email já cadastrado");
            }

            repo.save(usuario);
            return ResponseEntity.ok("Usuário criado");
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest request) {

            Optional<Usuario> opt = repo.findByEmail(request.email);

            if (opt.isEmpty()) {
                return ResponseEntity.status(401).body("Credenciais inválidas");
            }

            Usuario usuario = opt.get();

            if (!usuario.getSenha().equals(request.senha)) {
                return ResponseEntity.status(401).body("Credenciais inválidas");
            }

            return ResponseEntity.ok(new LoginResponse(usuario));
        }
    }

