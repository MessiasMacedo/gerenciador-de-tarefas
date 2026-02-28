package conn.Controller;

import conn.Infra.security.TokenService;
import conn.Model.Usuario;
import conn.Service.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<?> autenticar(@RequestBody LoginRequest dados) {
        var tokenAuthentication = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = authenticationManager.authenticate(tokenAuthentication);
        var usuario = (Usuario) authentication.getPrincipal();
        var token = tokenService.Gerartoken(usuario);


        return ResponseEntity.ok(new TokenResponse(token, usuario));
    }
}
