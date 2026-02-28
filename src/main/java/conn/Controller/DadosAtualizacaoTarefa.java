package conn.Controller;

public record DadosAtualizacaoTarefa(
        String titulo,
        String descricao,
        String prioridade,
        Boolean concluida
)
{}
