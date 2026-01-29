package conn.Repository;

import conn.Model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

public abstract class TarefaRepository implements JpaRepository<Tarefa, Long> {
/*
* aqui ele salva no banco
* O Spring vai criar a implementação automaticamente
*Tarefa  → qual entidade eu vou salvar
* Long    → tipo do ID da Tarefa
* “Spring, cuida da tabela tarefas pra mim”
* e por usar o spring a gente usa Métodos de graça , save,delete..
* */
}
