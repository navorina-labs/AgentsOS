# TLS: Kubernetes Ingress, Traefik, CBOM NIST

## Inventory

`safetyos inventory tls <dir>` сканирует:

| Источник | Файлы / паттерны |
|----------|------------------|
| nginx | `*.conf`, `ssl_protocols` |
| haproxy | `haproxy.cfg` |
| env / docker | `.env`, `docker-compose.yml` |
| **k8s-ingress** | `*ingress*.yaml`, аннотации `nginx.ingress.kubernetes.io/ssl-*`, `alb.ingress.kubernetes.io/ssl-policy` |
| **traefik** | `traefik*.yaml`, `minVersion`, `cipherSuites` |

Примеры: `examples/tls-configs/ingress-weak.yaml`, `traefik-tls.yaml`.

```bash
safetyos inventory tls examples/tls-configs
safetyos inventory reconcile -m threat-model.yaml --config examples/tls-configs
```

## CBOM: NIST migration

Для `quantum_vulnerable` алгоритмов в компонентах CBOM:

| Property | Пример |
|----------|--------|
| `safetyos:nist-migration-state` | `migration-required` / `migrated-pqc` |
| `safetyos:nist-migration-target` | `ML-KEM-768` |
| `safetyos:nist-migration-role` | `key_exchange` |
| `safetyos:nist-ref` | `FIPS 203 (ML-KEM)` |
| `safetyos:nist-hybrid-transition` | `X25519 + ML-KEM-768` |

```bash
safetyos export cbom -m examples/sample-threat-model.yaml
```

## Профиль web3

```bash
safetyos profile list
safetyos init -p web3 -n "My Protocol"
```

Долгий `confidentiality_years`, HNDL, политики против RSA/MD5 на permanent storage.
