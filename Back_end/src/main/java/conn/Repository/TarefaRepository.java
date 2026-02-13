package conn.Repository;

import conn.Model.Tarefa;
import conn.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long>{
    List<Tarefa> findByUsuario(Usuario usuario);

    List<Tarefa> findByUsuarioAndConcluida(Usuario usuario, boolean concluida);

    List<Tarefa> findByUsuarioAndPrioridade(Usuario usuario, String prioridade);

    List<Tarefa> findByUsuarioAndConcluidaAndPrioridade(Usuario usuario, boolean concluida, String prioridade);

    /*
* aqui ele salva no banco
* O Spring vai criar a implementação automaticamente
*Tarefa  → qual entidade eu vou salvar
* Long    → tipo do ID da Tarefa
* “Spring, cuida da tabela tarefas pra mim”
* e por usar o spring a gente usa Métodos de graça , save,delete..
* */
}
