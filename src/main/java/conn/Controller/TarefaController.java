package conn.Controller;

import conn.Model.Tarefa;
import conn.Model.Usuario;
import conn.Service.TarefaService;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    private final TarefaService service;

    public TarefaController(TarefaService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<Tarefa> criar(@RequestBody Tarefa tarefa) {
        return ResponseEntity.status(201)
                .body(service.criar(tarefa));
    }


    @GetMapping
    public ResponseEntity<List<Tarefa>> listar(
            @RequestParam String email,
            @RequestParam(required = false) Boolean concluida,
            @RequestParam(required = false) String prioridade
    ) {
        return ResponseEntity.ok(service.listar(email, concluida, prioridade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(
            @PathVariable Long id,
            @RequestBody Tarefa tarefa
    ) {
        return ResponseEntity.ok(service.atualizar(id, tarefa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
