# 5.8. Playbook: DevOps (GitLab CI, Ansible, Terraform, K8s, runbooks)

- **Last reviewed**: 2026-01-15
- **Уровень**: Advanced

## Когда применять

- нужно изменить pipeline, IaC или runbook

## Safety

- изменения CI/infra = зона повышенного риска
- запрещено включать секреты в контекст/PR
- агент предлагает → человек проверяет (A4)

## Output

- патч + объяснение
- runbook: Symptom → Checks → Mitigation → Rollback → Prevention

## Template prompt

> Предложи изменения в CI/IaC с учётом guardrails.  
> Сначала план + риски + rollback. Затем патч.  
> Не запускай команды и не трогай секреты без approve.

