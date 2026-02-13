package conn.Service;

import conn.Model.Tarefa;
import conn.Model.Usuario;
import conn.Repository.TarefaRepository;
import conn.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarefaService {

    private final TarefaRepository repository;
    private final UsuarioRepository usuarioRepo;


    public TarefaService(TarefaRepository repository, UsuarioRepository usuarioRepo) {
        this.repository = repository;
        this.usuarioRepo = usuarioRepo;
    }

    public Tarefa criar(Tarefa tarefa) {

        Long usuarioId = tarefa.getUsuario().getId();

        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        tarefa.setUsuario(usuario);

        return repository.save(tarefa);
    }

    public List<Tarefa> listar(String email, Boolean concluida, String prioridade) {

        Usuario usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // nenhum filtro
        if(concluida == null && prioridade == null){
            return repository.findByUsuario(usuario);
        }

        // filtro só por concluída
        if(concluida != null && prioridade == null){
            return repository.findByUsuarioAndConcluida(usuario, concluida);
        }

        // filtro só por prioridade
        if(concluida == null){
            return repository.findByUsuarioAndPrioridade(usuario, prioridade);
        }

        // filtro por ambos
        return repository.findByUsuarioAndConcluidaAndPrioridade(usuario, concluida, prioridade);
    }


    public Tarefa atualizar(Long id, Tarefa novaTarefa) {
        Tarefa tarefa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        tarefa.setTitulo(novaTarefa.getTitulo());
        tarefa.setDescricao(novaTarefa.getDescricao());
        tarefa.setPrioridade(novaTarefa.getPrioridade());
        tarefa.setConcluida(novaTarefa.getConcluida());

        return repository.save(tarefa);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Tarefa não encontrada");
        }
        repository.deleteById(id);
    }
}
