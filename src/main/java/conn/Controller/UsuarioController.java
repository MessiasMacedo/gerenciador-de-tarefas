package conn.Controller;


import conn.Model.Usuario;
import conn.Repository.UsuarioRepository;
import conn.Service.LoginRequest;
import conn.Service.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("usuario")
public class UsuarioController {

        private final UsuarioRepository repo;

        private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody Usuario usuario) {

            if (repo.findByEmail(usuario.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email já cadastrado");
            }

            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
            repo.save(usuario);repo.save(usuario);
            return ResponseEntity.ok("Usuário criado");
        }

    }

