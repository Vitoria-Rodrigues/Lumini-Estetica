import projectConfig from '@site/src/project.config';

export interface WorkspaceInfo {
  id: string;
  name: string;
  path: string;
  description: string;
  stack: string[];
  responsibilities: string[];
  ptBR?: Partial<WorkspaceInfo>;
}

export const MONOREPO_OVERVIEW: WorkspaceInfo = {
  id: 'root',
  name: `${projectConfig.PROJECT_DOMAIN} Architecture`,
  path: '/workspaces/intro',
  description:
    'A high-performance, strictly-typed monorepo built on PNPM Workspaces and Turborepo. This architecture enforces strict domain isolation while sharing critical core logic.',
  stack: ['PNPM v11', 'Turborepo', 'TypeScript 6', 'ESLint 10', 'Zig'],
  responsibilities: [
    'Single Source of Truth (SSOT) via /hub/packages/core',
    'Automated Task Orchestration',
    'Context-Driven Development isolation',
    'Shared Design Tokens & Visual Assets',
  ],
  ptBR: {
    name: `Arquitetura ${projectConfig.PROJECT_DOMAIN}`,
    description:
      'Um monorepo de alta performance e tipagem estrita construído com PNPM Workspaces e Turborepo. Esta arquitetura impõe um isolamento rigoroso de domínios enquanto compartilha lógica core crítica.',
    responsibilities: [
      'Fonte Única de Verdade (SSOT) via /hub/packages/core',
      'Orquestração de Tarefas Automatizada',
      'Isolamento de Desenvolvimento Orientado a Contexto',
      'Tokens de Design e Ativos Visuais Compartilhados',
    ],
  },
};

export const WORKSPACES: Record<string, WorkspaceInfo> = {
  agents: {
    id: 'agents',
    name: 'AI Agents Context',
    path: '/workspaces/agents',
    description:
      'Authoritative domain for agentic AI behavior customization, tool integration, and knowledge routing within the monorepo. It manages the lifecycle, personas, and Domain-Driven Design constraints for AI capabilities.',
    stack: ['Markdown', 'YAML', 'JSON', 'MCP Plugins'],
    responsibilities: [
      'Agent Persona Specifications',
      'Global and Context-Specific Rules',
      'MCP Server Definitions',
      'Task Execution Plans',
    ],
    ptBR: {
      name: 'Contexto de Agentes de IA',
      description:
        'Domínio autoritário para personalização de comportamento de IA, integração de ferramentas e roteamento de conhecimento no monorepo. Gerencia o ciclo de vida, personas e restrições de Domain-Driven Design para capacidades de IA.',
      responsibilities: [
        'Especificações de Personas de Agentes',
        'Regras Globais e Específicas por Contexto',
        'Definições de Servidores MCP',
        'Planos de Execução de Tarefas',
      ],
    },
  },
  cortex: {
    id: 'cortex',
    name: 'Cortex Context',
    path: '/workspaces/cortex',
    description:
      'Unified AI processing hub for the artificial intelligence architecture. Consolidates API ingress gateway routing, persistent vector memory, Model Context Protocol (MCP) tool adapters, and cloud-native Kubernetes deployment configurations.',
    stack: ['TypeScript', 'Fastify', 'MongoDB Vector', 'MCP', 'Docker'],
    responsibilities: [
      'AI Agent Ingress Gateway',
      'Vector RAG Subsystem',
      'Model Context Protocol Servers',
      'Control Plane Agents',
    ],
    ptBR: {
      name: 'Contexto do Cortex',
      description:
        'Hub unificado de processamento para a arquitetura de IA. Consolida o roteamento do gateway de API, memória vetorial persistente, adaptadores MCP e configurações de implantação cloud-native no Kubernetes.',
      responsibilities: [
        'Gateway de Ingress para Agentes de IA',
        'Subsistema Vector RAG',
        'Servidores Model Context Protocol',
        'Agentes de Control Plane',
      ],
    },
  },
  docs: {
    id: 'docs',
    name: 'Docs Hub',
    path: '/workspaces/docs',
    description:
      'Centralized, authoritative technical documentation hub and engineering masterplan. Built with Docusaurus, it provides a high-performance, strictly-typed product knowledge base structured under the Diátaxis framework.',
    stack: ['Docusaurus v3', 'MDX', 'Mermaid.js', 'TypeScript'],
    responsibilities: [
      'Engineering Architecture Docs',
      'Product Roadmap & Vision',
      'Internal Developer Portal',
      'Diátaxis Framework Integration',
    ],
    ptBR: {
      name: 'Hub de Documentação',
      description:
        'Hub autoritário e centralizado para documentação técnica e plano mestre de engenharia. Construído com Docusaurus, fornece uma base de conhecimento estruturada sob o framework Diátaxis.',
      responsibilities: [
        'Docs de Arquitetura de Engenharia',
        'Roadmap e Visão do Produto',
        'Portal Interno do Desenvolvedor',
        'Integração com Framework Diátaxis',
      ],
    },
  },
  hub: {
    id: 'hub',
    name: 'Hub Context',
    path: '/workspaces/hub',
    description:
      'Personal developer portal orchestrating the frontend portfolio, blog engine, and administration dashboard. It features a scalable REST API backend and strictly validated shared contracts.',
    stack: ['React 19', 'Fastify v5', 'MongoDB', 'Zustand', 'TailwindCSS v4'],
    responsibilities: [
      'Personal Portfolio frontend',
      'REST API backend',
      'Zod validation & shared contracts',
    ],
    ptBR: {
      name: 'Contexto do Hub',
      description:
        'Portal pessoal do desenvolvedor que orquestra o portfólio frontend, motor de blog e painel administrativo. Apresenta um backend de API REST escalável e contratos estritamente validados.',
      responsibilities: [
        'Frontend do Portfólio',
        'Backend da API REST',
        'Validação Zod e contratos compartilhados',
      ],
    },
  },
  infrastructure: {
    id: 'infrastructure',
    name: 'Infrastructure Context',
    path: '/workspaces/infrastructure',
    description:
      'Centralized Kubernetes orchestration and GitOps deployment pipeline. Replaces isolated compose configurations with a unified approach using Skaffold for real-time hot-reloading and scalable deployments.',
    stack: ['Kubernetes', 'Skaffold', 'Kustomize', 'Docker'],
    responsibilities: [
      'Kubernetes Cluster Orchestration',
      'Local Dev Hot-Reloading',
      'GitOps Deployment Pipelines',
      'Resource Manifest Management',
    ],
    ptBR: {
      name: 'Contexto de Infraestrutura',
      description:
        'Orquestração centralizada do Kubernetes e pipeline de deploy GitOps. Substitui configurações isoladas por uma abordagem unificada com Skaffold para hot-reload em tempo real e deployments escaláveis.',
      responsibilities: [
        'Orquestração de Cluster Kubernetes',
        'Hot-Reloading para Dev Local',
        'Pipelines de Deploy GitOps',
        'Gerenciamento de Manifestos de Recursos',
      ],
    },
  },
  platform: {
    id: 'platform',
    name: 'Platform Context',
    path: '/workspaces/platform',
    description:
      'Always-on operational cluster infrastructure and telemetry aggregation. Provides essential observability pipelines, networking ingress control, administration dashboards, and Turborepo remote build caching.',
    stack: ['OpenTelemetry', 'Turborepo', 'Traefik', 'Prometheus'],
    responsibilities: [
      'Telemetry Collection & Tracing',
      'Distributed Build Caching',
      'Cluster Observability & Ingress',
    ],
    ptBR: {
      name: 'Contexto da Plataforma',
      description:
        'Infraestrutura operacional contínua do cluster e agregação de telemetria. Fornece pipelines de observabilidade, controle de rede, painéis de administração e cache de build remoto.',
      responsibilities: [
        'Coleta de Telemetria e Tracing',
        'Cache de Build Distribuído',
        'Observabilidade e Ingress do Cluster',
      ],
    },
  },
  renderer: {
    id: 'renderer',
    name: 'Renderer Context',
    path: '/workspaces/renderer',
    description:
      'A generic dynamic asset generator and document compilation engine. Responsible for generating custom visual SVG cards and compiling markdown templates into production-grade documents across the monorepo.',
    stack: ['TypeScript', 'TailwindCSS v4', 'Node.js'],
    responsibilities: [
      'Dynamic Asset Generation',
      'README Document Compilation',
      'Token Integration & Processing',
    ],
    ptBR: {
      name: 'Contexto do Renderer',
      description:
        'Motor genérico de geração de ativos dinâmicos e compilação de documentos. Responsável por gerar cartões SVG visuais e compilar templates markdown em documentos de nível de produção.',
      responsibilities: [
        'Geração de Ativos Dinâmicos',
        'Compilação de Documentos README',
        'Processamento e Integração de Tokens',
      ],
    },
  },
  shared: {
    id: 'shared',
    name: 'Shared Context',
    path: '/workspaces/shared',
    description:
      'Foundational utilities, configuration definitions, and Git lifecycle scripts. Enforces global configuration parity, centralized project metadata, and cross-workspace specifications that power the entire monorepo.',
    stack: ['TypeScript', 'Zod', 'Husky', 'Prettier'],
    responsibilities: [
      'Cross-workspace Shared Types',
      'Common Utilities & Helpers',
      'Shared Data Contracts & Git Hooks',
    ],
    ptBR: {
      name: 'Contexto Compartilhado',
      description:
        'Utilitários fundamentais, definições de configuração e scripts de ciclo de vida do Git. Garante a paridade de configuração global, metadados do projeto e especificações compartilhadas.',
      responsibilities: [
        'Tipos Compartilhados entre Workspaces',
        'Utilitários e Helpers Comuns',
        'Contratos de Dados e Git Hooks',
      ],
    },
  },
  studio: {
    id: 'studio',
    name: 'Studio Context',
    path: '/workspaces/studio',
    description:
      'The single source of truth for visual identity, design system tokens, and UI consistency. Houses brand asset management pipelines, and self-hosted collaborative design infrastructure like Penpot.',
    stack: ['TailwindCSS v4', 'PostCSS', 'Style Dictionary'],
    responsibilities: [
      'Canonical Design Tokens',
      'Brand Asset Management',
      'Visual Consistency across contexts',
    ],
    ptBR: {
      name: 'Contexto do Studio',
      description:
        'A fonte única de verdade para identidade visual, tokens do sistema de design e consistência de UI. Abriga os pipelines de ativos de marca e infraestrutura de design colaborativo.',
      responsibilities: [
        'Tokens de Design Canônicos',
        'Gerenciamento de Ativos de Marca',
        'Consistência Visual entre contextos',
      ],
    },
  },
  tools: {
    id: 'tools',
    name: 'Tools Context',
    path: '/workspaces/tools',
    description:
      'Infrastructure orchestration hub and technical automation backbone. Centralizes development utilities, git automation scripts, and provides AI Agent containerized workspaces with GitHub CLI integrations.',
    stack: ['Model Context Protocol (MCP)', 'Docker', 'Shell Scripts'],
    responsibilities: [
      'AI Agent Context Servers',
      'Dev Environment Setup',
      'CI/CD Pipeline Automation',
    ],
    ptBR: {
      name: 'Contexto de Ferramentas',
      description:
        'Hub de orquestração de infraestrutura e espinha dorsal de automação. Centraliza utilitários de desenvolvimento, scripts de automação git e fornece workspaces de Agentes de IA em contêineres.',
      responsibilities: [
        'Servidores de Contexto para Agentes de IA',
        'Configuração de Ambiente de Desenvolvimento',
        'Automação de Pipelines CI/CD',
      ],
    },
  },
};
