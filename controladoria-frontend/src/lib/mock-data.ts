import { Case, Solicitacao, Processo, DefesoPeriod, KnowledgeArticle, Notification } from './types';

// Dados mockados para demonstração
export const mockCases: Case[] = [
  {
    id: '1',
    pescador: {
      id: 'p1',
      nome: 'João da Silva Santos',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      dataNascimento: new Date('1975-03-15'),
      endereco: 'Rua das Ostras, 123, Praia Grande',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-123456',
      rgpDataEmissao: new Date('2020-01-10'),
      telefone: '(13) 98765-4321',
      email: 'joao.silva@email.com',
    },
    status: 'aprovado',
    documents: [
      {
        id: 'd1',
        type: 'rg',
        name: 'RG_Joao_Silva.pdf',
        url: '/docs/rg_joao.pdf',
        uploadedAt: new Date('2024-10-01'),
        status: 'presente',
      },
      {
        id: 'd2',
        type: 'cpf',
        name: 'CPF_Joao_Silva.pdf',
        url: '/docs/cpf_joao.pdf',
        uploadedAt: new Date('2024-10-01'),
        status: 'presente',
      },
      {
        id: 'd3',
        type: 'rgp',
        name: 'RGP_Joao_Silva.pdf',
        url: '/docs/rgp_joao.pdf',
        uploadedAt: new Date('2024-10-01'),
        status: 'presente',
      },
      {
        id: 'd4',
        type: 'comprovante_residencia',
        name: 'Comprovante_Residencia.pdf',
        url: '/docs/comp_res.pdf',
        uploadedAt: new Date('2024-10-01'),
        status: 'presente',
      },
      {
        id: 'd5',
        type: 'declaracao_colonia',
        name: 'Declaracao_Colonia.pdf',
        url: '/docs/declaracao.pdf',
        uploadedAt: new Date('2024-10-01'),
        status: 'presente',
      },
      {
        id: 'd6',
        type: 'comprovante_venda',
        name: 'Notas_Fiscais_2024.pdf',
        url: '/docs/vendas.pdf',
        uploadedAt: new Date('2024-10-01'),
        status: 'presente',
      },
    ],
    analysis: {
      id: 'a1',
      caseId: '1',
      score: 92,
      eligibilityChecks: [
        {
          criterion: 'Registro como pescador profissional há pelo menos 1 ano',
          status: 'approved',
          details: 'RGP emitido em 10/01/2020 - 4 anos e 9 meses',
        },
        {
          criterion: 'RGP ativo e válido',
          status: 'approved',
          details: 'RGP SP-123456 válido até 10/01/2025',
        },
        {
          criterion: 'Exercício da pesca de forma ininterrupta',
          status: 'approved',
          details: 'Comprovantes de venda mensais desde 2020',
        },
        {
          criterion: 'Sem vínculo empregatício permanente',
          status: 'approved',
          details: 'Carteira de trabalho sem registros ativos',
        },
        {
          criterion: 'Comprovação de comercialização',
          status: 'approved',
          details: '12 notas fiscais de venda nos últimos 12 meses',
        },
        {
          criterion: 'Associação à Colônia de Pescadores',
          status: 'approved',
          details: 'Declaração da Colônia Z-10 Santos válida',
        },
      ],
      missingDocuments: [],
      inconsistencies: [],
      recommendations: [
        'Caso pronto para submissão',
        'Recomendar ao cliente guardar novos comprovantes de venda',
      ],
      analyzedAt: new Date('2024-10-15'),
      aiConfidence: 95,
    },
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-15'),
    lawyerNotes: 'Cliente muito organizado, documentação completa.',
    priority: 'media',
    numeroProcesso: '0001234-56.2024.8.26.0562',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '2ª Vara Cível de Santos',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Em andamento',
    dataAjuizamento: new Date('2024-09-15'),
    movimentacoes: 8,
    ultimaMovimentacao: new Date('2024-10-20'),
  },
  {
    id: '2',
    pescador: {
      id: 'p2',
      nome: 'Maria Oliveira Costa',
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      dataNascimento: new Date('1982-07-22'),
      endereco: 'Av. Beira Mar, 456, Guarujá',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-789012',
      rgpDataEmissao: new Date('2023-06-15'),
      telefone: '(13) 97654-3210',
    },
    status: 'documentacao_incompleta',
    documents: [
      {
        id: 'd7',
        type: 'rg',
        name: 'RG_Maria.pdf',
        url: '/docs/rg_maria.pdf',
        uploadedAt: new Date('2024-10-10'),
        status: 'presente',
      },
      {
        id: 'd8',
        type: 'cpf',
        name: 'CPF_Maria.pdf',
        url: '/docs/cpf_maria.pdf',
        uploadedAt: new Date('2024-10-10'),
        status: 'presente',
      },
      {
        id: 'd9',
        type: 'rgp',
        name: 'RGP_Maria.pdf',
        url: '/docs/rgp_maria.pdf',
        uploadedAt: new Date('2024-10-10'),
        status: 'presente',
      },
      {
        id: 'd10',
        type: 'comprovante_residencia',
        name: 'Conta_Luz.pdf',
        url: '/docs/conta_luz.pdf',
        uploadedAt: new Date('2024-10-10'),
        status: 'presente',
      },
    ],
    analysis: {
      id: 'a2',
      caseId: '2',
      score: 58,
      eligibilityChecks: [
        {
          criterion: 'Registro como pescador profissional há pelo menos 1 ano',
          status: 'approved',
          details: 'RGP emitido em 15/06/2023 - 1 ano e 4 meses',
        },
        {
          criterion: 'RGP ativo e válido',
          status: 'approved',
          details: 'RGP SP-789012 válido',
        },
        {
          criterion: 'Exercício da pesca de forma ininterrupta',
          status: 'warning',
          details: 'Faltam comprovantes de venda para verificação',
        },
        {
          criterion: 'Comprovação de comercialização',
          status: 'rejected',
          details: 'Documento não apresentado',
        },
        {
          criterion: 'Associação à Colônia de Pescadores',
          status: 'rejected',
          details: 'Declaração da Colônia não apresentada',
        },
      ],
      missingDocuments: ['declaracao_colonia', 'comprovante_venda'],
      inconsistencies: [
        'RGP emitido há pouco mais de 1 ano - limite mínimo',
      ],
      recommendations: [
        'Solicitar declaração atualizada da Colônia Z-10',
        'Solicitar pelo menos 6 comprovantes de venda de pescado',
        'Verificar se há carteira de trabalho ativa',
      ],
      analyzedAt: new Date('2024-10-18'),
      aiConfidence: 78,
    },
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-18'),
    priority: 'alta',
    numeroProcesso: '0002345-67.2024.8.26.0223',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '1ª Vara Cível do Guarujá',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Aguardando juntada de documentos',
    dataAjuizamento: new Date('2024-09-28'),
    movimentacoes: 5,
    ultimaMovimentacao: new Date('2024-10-18'),
  },
  {
    id: '3',
    pescador: {
      id: 'p3',
      nome: 'Carlos Eduardo Pereira',
      cpf: '456.789.123-00',
      rg: '45.678.912-3',
      dataNascimento: new Date('1968-11-30'),
      endereco: 'Rua do Porto, 789, Bertioga',
      colonia: 'Z-11 Bertioga',
      rgpNumero: 'SP-345678',
      rgpDataEmissao: new Date('2018-03-20'),
      telefone: '(13) 96543-2109',
    },
    status: 'em_analise',
    documents: [
      {
        id: 'd11',
        type: 'rg',
        name: 'RG_Carlos.pdf',
        url: '/docs/rg_carlos.pdf',
        uploadedAt: new Date('2024-10-20'),
        status: 'presente',
      },
      {
        id: 'd12',
        type: 'cpf',
        name: 'CPF_Carlos.pdf',
        url: '/docs/cpf_carlos.pdf',
        uploadedAt: new Date('2024-10-20'),
        status: 'presente',
      },
      {
        id: 'd13',
        type: 'rgp',
        name: 'RGP_Carlos.pdf',
        url: '/docs/rgp_carlos.pdf',
        uploadedAt: new Date('2024-10-20'),
        status: 'presente',
      },
      {
        id: 'd14',
        type: 'comprovante_residencia',
        name: 'Comprovante.pdf',
        url: '/docs/comp.pdf',
        uploadedAt: new Date('2024-10-20'),
        status: 'presente',
      },
      {
        id: 'd15',
        type: 'declaracao_colonia',
        name: 'Declaracao_Z11.pdf',
        url: '/docs/decl_z11.pdf',
        uploadedAt: new Date('2024-10-20'),
        status: 'presente',
      },
      {
        id: 'd16',
        type: 'comprovante_venda',
        name: 'Vendas_2024.pdf',
        url: '/docs/vendas_carlos.pdf',
        uploadedAt: new Date('2024-10-20'),
        status: 'presente',
      },
    ],
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
    priority: 'media',
    numeroProcesso: '0003456-78.2024.8.26.0077',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: 'Vara Única de Bertioga',
    classeProcessual: 'Mandado de Segurança',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Concluso para decisão',
    dataAjuizamento: new Date('2024-10-01'),
    movimentacoes: 12,
    ultimaMovimentacao: new Date('2024-10-25'),
  },
  {
    id: '4',
    pescador: {
      id: 'p4',
      nome: 'Ana Paula Rodrigues',
      cpf: '321.654.987-00',
      rg: '32.165.498-7',
      dataNascimento: new Date('1990-05-12'),
      endereco: 'Travessa dos Pescadores, 12, Mongaguá',
      colonia: 'Z-12 Mongaguá',
      telefone: '(13) 95432-1098',
    },
    status: 'pendente',
    documents: [],
    createdAt: new Date('2024-10-22'),
    updatedAt: new Date('2024-10-22'),
    priority: 'baixa',
    numeroProcesso: '0004567-89.2024.8.26.0362',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: 'Vara Única de Mongaguá',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Distribuído',
    dataAjuizamento: new Date('2024-10-22'),
    movimentacoes: 2,
    ultimaMovimentacao: new Date('2024-10-22'),
  },
  {
    id: '5',
    pescador: {
      id: 'p5',
      nome: 'Roberto Alves Ferreira',
      cpf: '159.753.486-00',
      rg: '15.975.348-6',
      dataNascimento: new Date('1972-09-08'),
      endereco: 'Rua da Praia, 321, Peruíbe',
      colonia: 'Z-13 Peruíbe',
      rgpNumero: 'SP-951753',
      rgpDataEmissao: new Date('2019-08-12'),
      telefone: '(13) 94321-0987',
    },
    status: 'negado',
    documents: [
      {
        id: 'd17',
        type: 'rg',
        name: 'RG_Roberto.pdf',
        url: '/docs/rg_roberto.pdf',
        uploadedAt: new Date('2024-10-05'),
        status: 'presente',
      },
      {
        id: 'd18',
        type: 'cpf',
        name: 'CPF_Roberto.pdf',
        url: '/docs/cpf_roberto.pdf',
        uploadedAt: new Date('2024-10-05'),
        status: 'presente',
      },
      {
        id: 'd19',
        type: 'rgp',
        name: 'RGP_Roberto.pdf',
        url: '/docs/rgp_roberto.pdf',
        uploadedAt: new Date('2024-10-05'),
        status: 'invalido',
        expirationDate: new Date('2024-08-12'),
      },
      {
        id: 'd20',
        type: 'carteira_trabalho',
        name: 'CTPS_Roberto.pdf',
        url: '/docs/ctps_roberto.pdf',
        uploadedAt: new Date('2024-10-05'),
        status: 'presente',
      },
    ],
    analysis: {
      id: 'a3',
      caseId: '5',
      score: 23,
      eligibilityChecks: [
        {
          criterion: 'RGP ativo e válido',
          status: 'rejected',
          details: 'RGP vencido em 12/08/2024',
        },
        {
          criterion: 'Sem vínculo empregatício permanente',
          status: 'rejected',
          details: 'CTPS indica vínculo ativo como servente de pedreiro desde 2023',
        },
        {
          criterion: 'Comprovação de comercialização',
          status: 'rejected',
          details: 'Nenhum comprovante de venda apresentado',
        },
      ],
      missingDocuments: ['comprovante_venda', 'declaracao_colonia'],
      inconsistencies: [
        'RGP vencido há 2 meses',
        'Vínculo empregatício CLT ativo',
        'Incompatibilidade entre atividade declarada e documentação',
      ],
      recommendations: [
        'Caso não elegível - vínculo empregatício impeditivo',
        'Orientar cliente sobre impossibilidade de acumular CLT com Seguro-Defeso',
        'Sugerir renovação do RGP caso deseje manter atividade pesqueira',
      ],
      analyzedAt: new Date('2024-10-12'),
      aiConfidence: 92,
    },
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-12'),
    lawyerNotes: 'Cliente informado sobre inelegibilidade. Caso arquivado.',
    priority: 'baixa',
    numeroProcesso: '0005678-90.2024.8.26.0445',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '1ª Vara Cível de Peruíbe',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Sentença proferida - Improcedente',
    dataAjuizamento: new Date('2024-09-20'),
    movimentacoes: 15,
    ultimaMovimentacao: new Date('2024-10-12'),
  },
  {
    id: '6',
    pescador: {
      id: 'p6',
      nome: 'Francisco Santos Lima',
      cpf: '753.951.486-00',
      rg: '75.395.148-6',
      dataNascimento: new Date('1978-02-18'),
      endereco: 'Rua do Pescador, 88, Santos',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-753951',
      rgpDataEmissao: new Date('2021-04-10'),
      telefone: '(13) 99887-6655',
    },
    status: 'aprovado',
    documents: [
      { id: 'd21', type: 'rg', name: 'RG_Francisco.pdf', url: '/docs/rg_francisco.pdf', uploadedAt: new Date('2024-09-15'), status: 'presente' },
      { id: 'd22', type: 'cpf', name: 'CPF_Francisco.pdf', url: '/docs/cpf_francisco.pdf', uploadedAt: new Date('2024-09-15'), status: 'presente' },
      { id: 'd23', type: 'rgp', name: 'RGP_Francisco.pdf', url: '/docs/rgp_francisco.pdf', uploadedAt: new Date('2024-09-15'), status: 'presente' },
    ],
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-20'),
    priority: 'media',
    numeroProcesso: '0006789-01.2024.8.26.0562',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '3ª Vara Cível de Santos',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Sentença favorável',
    dataAjuizamento: new Date('2024-08-10'),
    movimentacoes: 10,
    ultimaMovimentacao: new Date('2024-09-28'),
  },
  {
    id: '7',
    pescador: {
      id: 'p7',
      nome: 'Luísa Fernandes Souza',
      cpf: '852.963.741-00',
      rg: '85.296.374-1',
      dataNascimento: new Date('1985-12-05'),
      endereco: 'Av. Atlântica, 200, Guarujá',
      colonia: 'Z-10 Santos',
      telefone: '(13) 98765-1234',
    },
    status: 'em_analise',
    documents: [
      { id: 'd24', type: 'rg', name: 'RG_Luisa.pdf', url: '/docs/rg_luisa.pdf', uploadedAt: new Date('2024-10-25'), status: 'presente' },
      { id: 'd25', type: 'cpf', name: 'CPF_Luisa.pdf', url: '/docs/cpf_luisa.pdf', uploadedAt: new Date('2024-10-25'), status: 'presente' },
    ],
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25'),
    priority: 'media',
    numeroProcesso: '0007890-12.2024.8.26.0223',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '2ª Vara Cível do Guarujá',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Distribuído',
    dataAjuizamento: new Date('2024-10-20'),
    movimentacoes: 3,
    ultimaMovimentacao: new Date('2024-10-25'),
  },
  {
    id: '8',
    pescador: {
      id: 'p8',
      nome: 'Pedro Henrique Costa',
      cpf: '147.258.369-00',
      rg: '14.725.836-9',
      dataNascimento: new Date('1980-06-14'),
      endereco: 'Rua Marítima, 150, Bertioga',
      colonia: 'Z-11 Bertioga',
      rgpNumero: 'SP-147258',
      rgpDataEmissao: new Date('2022-01-20'),
      telefone: '(13) 97654-8888',
    },
    status: 'documentacao_incompleta',
    documents: [
      { id: 'd26', type: 'rg', name: 'RG_Pedro.pdf', url: '/docs/rg_pedro.pdf', uploadedAt: new Date('2024-10-18'), status: 'presente' },
      { id: 'd27', type: 'cpf', name: 'CPF_Pedro.pdf', url: '/docs/cpf_pedro.pdf', uploadedAt: new Date('2024-10-18'), status: 'presente' },
      { id: 'd28', type: 'rgp', name: 'RGP_Pedro.pdf', url: '/docs/rgp_pedro.pdf', uploadedAt: new Date('2024-10-18'), status: 'presente' },
    ],
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-23'),
    priority: 'alta',
    numeroProcesso: '0008901-23.2024.8.26.0077',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: 'Vara Única de Bertioga',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Aguardando documentos',
    dataAjuizamento: new Date('2024-10-05'),
    movimentacoes: 6,
    ultimaMovimentacao: new Date('2024-10-23'),
  },
  {
    id: '9',
    pescador: {
      id: 'p9',
      nome: 'Juliana Martins Silva',
      cpf: '369.147.258-00',
      rg: '36.914.725-8',
      dataNascimento: new Date('1992-04-22'),
      endereco: 'Rua das Gaivotas, 77, Mongaguá',
      colonia: 'Z-12 Mongaguá',
      rgpNumero: 'SP-369147',
      rgpDataEmissao: new Date('2023-09-10'),
      telefone: '(13) 96543-7777',
    },
    status: 'aprovado',
    documents: [
      { id: 'd29', type: 'rg', name: 'RG_Juliana.pdf', url: '/docs/rg_juliana.pdf', uploadedAt: new Date('2024-10-08'), status: 'presente' },
      { id: 'd30', type: 'cpf', name: 'CPF_Juliana.pdf', url: '/docs/cpf_juliana.pdf', uploadedAt: new Date('2024-10-08'), status: 'presente' },
      { id: 'd31', type: 'rgp', name: 'RGP_Juliana.pdf', url: '/docs/rgp_juliana.pdf', uploadedAt: new Date('2024-10-08'), status: 'presente' },
    ],
    createdAt: new Date('2024-10-08'),
    updatedAt: new Date('2024-10-14'),
    priority: 'media',
    numeroProcesso: '0009012-34.2024.8.26.0362',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: 'Vara Única de Mongaguá',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Em andamento',
    dataAjuizamento: new Date('2024-09-25'),
    movimentacoes: 7,
    ultimaMovimentacao: new Date('2024-10-14'),
  },
  {
    id: '10',
    pescador: {
      id: 'p10',
      nome: 'Marcos Vinícius Rocha',
      cpf: '258.369.147-00',
      rg: '25.836.914-7',
      dataNascimento: new Date('1970-08-30'),
      endereco: 'Travessa do Mar, 33, Peruíbe',
      colonia: 'Z-13 Peruíbe',
      rgpNumero: 'SP-258369',
      rgpDataEmissao: new Date('2020-11-15'),
      telefone: '(13) 95432-6666',
    },
    status: 'pendente',
    documents: [],
    createdAt: new Date('2024-10-26'),
    updatedAt: new Date('2024-10-26'),
    priority: 'baixa',
    numeroProcesso: '0010123-45.2024.8.26.0445',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '1ª Vara Cível de Peruíbe',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Aguardando documentação',
    dataAjuizamento: new Date('2024-10-26'),
    movimentacoes: 1,
    ultimaMovimentacao: new Date('2024-10-26'),
  },
  {
    id: '11',
    pescador: {
      id: 'p11',
      nome: 'Sandra Regina Almeida',
      cpf: '951.357.852-00',
      rg: '95.135.785-2',
      dataNascimento: new Date('1983-03-11'),
      endereco: 'Rua Coral, 55, Santos',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-951357',
      rgpDataEmissao: new Date('2019-05-22'),
      telefone: '(13) 94321-5555',
    },
    status: 'aprovado',
    documents: [
      { id: 'd32', type: 'rg', name: 'RG_Sandra.pdf', url: '/docs/rg_sandra.pdf', uploadedAt: new Date('2024-09-28'), status: 'presente' },
      { id: 'd33', type: 'cpf', name: 'CPF_Sandra.pdf', url: '/docs/cpf_sandra.pdf', uploadedAt: new Date('2024-09-28'), status: 'presente' },
      { id: 'd34', type: 'rgp', name: 'RGP_Sandra.pdf', url: '/docs/rgp_sandra.pdf', uploadedAt: new Date('2024-09-28'), status: 'presente' },
    ],
    createdAt: new Date('2024-09-28'),
    updatedAt: new Date('2024-10-05'),
    priority: 'media',
    numeroProcesso: '0011234-56.2024.8.26.0562',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '1ª Vara Cível de Santos',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Sentença favorável',
    dataAjuizamento: new Date('2024-09-10'),
    movimentacoes: 9,
    ultimaMovimentacao: new Date('2024-10-05'),
  },
  {
    id: '12',
    pescador: {
      id: 'p12',
      nome: 'Rafael dos Santos Barbosa',
      cpf: '357.159.753-00',
      rg: '35.715.975-3',
      dataNascimento: new Date('1987-07-07'),
      endereco: 'Av. Oceânica, 444, Guarujá',
      colonia: 'Z-10 Santos',
      telefone: '(13) 93210-4444',
    },
    status: 'em_analise',
    documents: [
      { id: 'd35', type: 'rg', name: 'RG_Rafael.pdf', url: '/docs/rg_rafael.pdf', uploadedAt: new Date('2024-10-24'), status: 'presente' },
      { id: 'd36', type: 'cpf', name: 'CPF_Rafael.pdf', url: '/docs/cpf_rafael.pdf', uploadedAt: new Date('2024-10-24'), status: 'presente' },
    ],
    createdAt: new Date('2024-10-24'),
    updatedAt: new Date('2024-10-26'),
    priority: 'alta',
    numeroProcesso: '0012345-67.2024.8.26.0223',
    tribunal: 'TJSP - Tribunal de Justiça de São Paulo',
    orgaoJulgador: '3ª Vara Cível do Guarujá',
    classeProcessual: 'Mandado de Segurança',
    assunto: 'Seguro-Defeso / Benefício Previdenciário',
    situacao: 'Concluso para decisão',
    dataAjuizamento: new Date('2024-10-18'),
    movimentacoes: 4,
    ultimaMovimentacao: new Date('2024-10-26'),
  },
];

export const mockDefesoPeriods: DefesoPeriod[] = [
  {
    id: 'dp1',
    regiao: 'Litoral de São Paulo',
    especie: 'Camarão',
    inicio: new Date('2025-03-01'),
    fim: new Date('2025-05-31'),
    anoReferencia: 2025,
  },
  {
    id: 'dp2',
    regiao: 'Litoral de São Paulo',
    especie: 'Tainha',
    inicio: new Date('2025-06-01'),
    fim: new Date('2025-07-31'),
    anoReferencia: 2025,
  },
  {
    id: 'dp3',
    regiao: 'Litoral Norte SP',
    especie: 'Sardinha',
    inicio: new Date('2024-12-01'),
    fim: new Date('2025-02-28'),
    anoReferencia: 2024,
  },
  {
    id: 'dp4',
    regiao: 'Baixada Santista',
    especie: 'Camarão-rosa',
    inicio: new Date('2025-03-01'),
    fim: new Date('2025-05-31'),
    anoReferencia: 2025,
  },
];

export const mockKnowledgeBase: KnowledgeArticle[] = [
  {
    id: 'kb1',
    title: 'O que é o Seguro-Defeso?',
    category: 'faq',
    content: `O Seguro-Defeso, também conhecido como Seguro Desemprego do Pescador Artesanal, é um benefício concedido aos pescadores profissionais artesanais durante o período de defeso (proibição da pesca para preservação das espécies).

Durante este período, o pescador fica impedido de exercer sua atividade e, portanto, tem direito a receber uma assistência financeira temporária do governo federal.

**Valor do benefício:** O valor corresponde a um salário-mínimo mensal durante o período do defeso.

**Quem tem direito:**
- Pescadores profissionais artesanais
- Que exerçam a pesca de forma ininterrupta
- Registrados no Registro Geral da Pesca (RGP)
- Sem vínculo empregatício permanente`,
    lastUpdated: new Date('2024-10-01'),
    tags: ['seguro-defeso', 'benefícios', 'introdução'],
  },
  {
    id: 'kb2',
    title: 'Legislação aplicável',
    category: 'legislacao',
    content: `**Lei nº 10.779/2003**
Dispõe sobre a concessão do benefício de seguro desemprego, durante o período de defeso, ao pescador profissional que exerce a atividade pesqueira de forma artesanal.

**Lei nº 8.287/1991**
Estabelece normas sobre o seguro-desemprego e revoga dispositivos anteriores.

**Instrução Normativa INSS/PRES nº 128/2022**
Disciplina os procedimentos e rotinas de reconhecimento de direitos de segurados e beneficiários da Previdência Social.

**Principais artigos:**
- Art. 1º - Define os beneficiários
- Art. 2º - Estabelece os requisitos
- Art. 3º - Determina o valor do benefício`,
    lastUpdated: new Date('2024-09-15'),
    tags: ['legislação', 'leis', 'normativas'],
  },
  {
    id: 'kb3',
    title: 'Documentação necessária - Checklist completo',
    category: 'procedimentos',
    content: `**Documentos obrigatórios:**

1. **RG (Registro Geral)**
   - Original e cópia
   - Deve estar legível
   
2. **CPF**
   - Original e cópia ou consulta online

3. **Registro Geral da Pesca (RGP)**
   - Categoria: Pescador Profissional Artesanal
   - Emitido há pelo menos 1 ano da data do requerimento
   - Válido e ativo

4. **Comprovante de Residência**
   - Atualizado (últimos 3 meses)
   - Aceitos: conta de luz, água, telefone

5. **Declaração da Colônia de Pescadores**
   - Atestando o exercício da pesca artesanal
   - Com firma reconhecida do presidente da colônia

6. **Comprovante de comercialização de pescado**
   - Mínimo 6 meses do último ano
   - Notas fiscais, recibos ou declarações

7. **Carteira de Trabalho (CTPS)**
   - Todas as páginas (inclusive em branco)
   - Para comprovar ausência de vínculo empregatício

**Documentos complementares:**
- Certidão de casamento/nascimento
- Comprovante de conta bancária
- Fotos 3x4 recentes`,
    lastUpdated: new Date('2024-10-10'),
    tags: ['documentação', 'checklist', 'procedimentos'],
  },
  {
    id: 'kb4',
    title: 'Modelo de Requerimento',
    category: 'modelos',
    content: `**REQUERIMENTO DE SEGURO-DEFESO**

À Superintendência Regional do Trabalho e Emprego
[Cidade/Estado]

[Nome completo do pescador], [nacionalidade], [estado civil], portador do RG nº [número] e CPF nº [número], residente e domiciliado à [endereço completo], pescador profissional artesanal, inscrito no Registro Geral da Pesca sob nº [RGP], vem, respeitosamente, à presença de Vossa Senhoria, REQUERER o benefício do Seguro-Defeso referente ao período de defeso de [espécie] na região de [região], com início em [data] e término em [data].

Para tanto, apresenta os seguintes documentos:
1. RG e CPF
2. Registro Geral da Pesca (RGP)
3. Comprovante de residência
4. Declaração da Colônia de Pescadores [nome/número]
5. Comprovantes de comercialização de pescado
6. Carteira de Trabalho

Nestes termos,
Pede deferimento.

[Cidade], [data]

_________________________________
[Nome do pescador]
CPF: [número]`,
    lastUpdated: new Date('2024-08-20'),
    tags: ['modelos', 'requerimento', 'documentos'],
  },
];

// Função para simular análise de IA
export function simulateAIAnalysis(documents: any[]): Promise<any> {
  return new Promise((resolve) => {
    // Simula processamento de 3 segundos
    setTimeout(() => {
      const hasRGP = documents.some((d) => d.type === 'rgp');
      const hasDeclaracao = documents.some((d) => d.type === 'declaracao_colonia');
      const hasVenda = documents.some((d) => d.type === 'comprovante_venda');
      const hasRG = documents.some((d) => d.type === 'rg');
      const hasCPF = documents.some((d) => d.type === 'cpf');

      const docCount = documents.length;
      let score = 30;

      if (hasRG) score += 10;
      if (hasCPF) score += 10;
      if (hasRGP) score += 20;
      if (hasDeclaracao) score += 15;
      if (hasVenda) score += 15;

      const missingDocs: any[] = [];
      if (!hasRGP) missingDocs.push('rgp');
      if (!hasDeclaracao) missingDocs.push('declaracao_colonia');
      if (!hasVenda) missingDocs.push('comprovante_venda');
      if (!hasRG) missingDocs.push('rg');
      if (!hasCPF) missingDocs.push('cpf');

      const analysis = {
        id: `a${Date.now()}`,
        score,
        eligibilityChecks: [
          {
            criterion: 'Documentos básicos apresentados',
            status: hasRG && hasCPF ? 'approved' : 'rejected',
            details: hasRG && hasCPF ? 'RG e CPF presentes' : 'Faltam documentos básicos',
          },
          {
            criterion: 'RGP válido',
            status: hasRGP ? 'approved' : 'rejected',
            details: hasRGP ? 'RGP apresentado' : 'RGP não apresentado',
          },
          {
            criterion: 'Comprovação de atividade pesqueira',
            status: hasVenda ? 'approved' : 'rejected',
            details: hasVenda ? 'Comprovantes de venda apresentados' : 'Sem comprovação de vendas',
          },
          {
            criterion: 'Vínculo com Colônia',
            status: hasDeclaracao ? 'approved' : 'warning',
            details: hasDeclaracao ? 'Declaração da Colônia apresentada' : 'Falta declaração da Colônia',
          },
        ],
        missingDocuments: missingDocs,
        inconsistencies: docCount < 5 ? ['Poucos documentos apresentados'] : [],
        recommendations:
          score >= 70
            ? ['Documentação adequada', 'Prosseguir com o pedido']
            : ['Solicitar documentos faltantes', 'Revisar informações'],
        analyzedAt: new Date(),
        aiConfidence: Math.min(95, 60 + docCount * 5),
      };

      resolve(analysis);
    }, 3000);
  });
}

// Mock de notificações
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'analysis_complete',
    title: 'Análise Concluída',
    message: 'A análise do caso de João da Silva Santos foi concluída com score de 95%',
    caseId: '1',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    priority: 'high',
  },
  {
    id: 'n2',
    type: 'document_missing',
    title: 'Documentos Faltantes',
    message: 'O caso de Maria Oliveira está com documentação incompleta. Faltam: Comprovante de Residência',
    caseId: '2',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
    priority: 'medium',
  },
  {
    id: 'n3',
    type: 'status_change',
    title: 'Status Alterado',
    message: 'O caso #1 foi aprovado e está pronto para envio ao INSS',
    caseId: '1',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    priority: 'high',
  },
  {
    id: 'n4',
    type: 'deadline_approaching',
    title: 'Prazo Aproximando',
    message: 'O período de defeso para a região Sul termina em 15 dias. Lembre-se de protocolar os casos pendentes.',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    priority: 'medium',
  },
  {
    id: 'n5',
    type: 'case_created',
    title: 'Novo Caso Criado',
    message: 'Um novo caso foi adicionado ao sistema: Carlos Mendes',
    caseId: '3',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    priority: 'low',
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Atualização do Sistema',
    message: 'Nova versão disponível com melhorias na análise de documentos por IA',
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    priority: 'low',
  },
  {
    id: 'n7',
    type: 'alert',
    title: 'Atenção: Mudança na Legislação',
    message: 'A Instrução Normativa INSS/PRES nº 128/2022 foi atualizada. Revise os novos critérios.',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
    priority: 'high',
  },
  {
    id: 'n8',
    type: 'analysis_complete',
    title: 'Análise Concluída',
    message: 'A análise do caso de Pedro Costa foi concluída com score de 78%',
    caseId: '4',
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 dias atrás
    priority: 'medium',
  },
];

// Dados mockados de Solicitações (pré-análise)
export const mockSolicitacoes: Solicitacao[] = [
  {
    id: 's1',
    pescador: {
      id: 'ps1',
      nome: 'José Carlos Mendes',
      cpf: '111.222.333-44',
      rg: '11.222.333-4',
      dataNascimento: new Date('1976-05-20'),
      endereco: 'Rua da Praia, 45, Bertioga',
      colonia: 'Z-11 Bertioga',
      rgpNumero: 'SP-111222',
      rgpDataEmissao: new Date('2021-03-10'),
      telefone: '(13) 99001-1122',
    },
    status: 'aprovada',
    documents: [
      { id: 'ds1', type: 'rg', name: 'RG_Jose.pdf', url: '/docs/rg_jose.pdf', uploadedAt: new Date('2024-10-15'), status: 'presente' },
      { id: 'ds2', type: 'cpf', name: 'CPF_Jose.pdf', url: '/docs/cpf_jose.pdf', uploadedAt: new Date('2024-10-15'), status: 'presente' },
      { id: 'ds3', type: 'rgp', name: 'RGP_Jose.pdf', url: '/docs/rgp_jose.pdf', uploadedAt: new Date('2024-10-15'), status: 'presente' },
      { id: 'ds4', type: 'declaracao_colonia', name: 'Declaracao_Jose.pdf', url: '/docs/dec_jose.pdf', uploadedAt: new Date('2024-10-15'), status: 'presente' },
      { id: 'ds5', type: 'comprovante_venda', name: 'Vendas_Jose.pdf', url: '/docs/vendas_jose.pdf', uploadedAt: new Date('2024-10-15'), status: 'presente' },
    ],
    analysis: {
      id: 'as1',
      caseId: 's1',
      score: 88,
      eligibilityChecks: [
        { criterion: 'Documentos básicos apresentados', status: 'approved', details: 'RG e CPF presentes' },
        { criterion: 'RGP válido', status: 'approved', details: 'RGP ativo desde 2021' },
        { criterion: 'Comprovação de atividade pesqueira', status: 'approved', details: 'Comprovantes de venda dos últimos 8 meses' },
        { criterion: 'Vínculo com Colônia', status: 'approved', details: 'Declaração da Colônia Z-11 presente' },
      ],
      missingDocuments: [],
      inconsistencies: [],
      recommendations: ['Documentação adequada para abertura de processo', 'Prosseguir com a ação judicial'],
      analyzedAt: new Date('2024-10-16'),
      aiConfidence: 90,
    },
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-16'),
    priority: 'alta',
    lawyerNotes: 'Cliente aprovado para abertura de processo. Aguardando decisão do advogado.',
  },
  {
    id: 's2',
    pescador: {
      id: 'ps2',
      nome: 'Fernanda Lima Santos',
      cpf: '222.333.444-55',
      rg: '22.333.444-5',
      dataNascimento: new Date('1988-11-08'),
      endereco: 'Av. Atlântica, 789, Praia Grande',
      colonia: 'Z-10 Santos',
      telefone: '(13) 98002-2233',
    },
    status: 'em_analise',
    documents: [
      { id: 'ds6', type: 'rg', name: 'RG_Fernanda.pdf', url: '/docs/rg_fernanda.pdf', uploadedAt: new Date('2024-10-27'), status: 'presente' },
      { id: 'ds7', type: 'cpf', name: 'CPF_Fernanda.pdf', url: '/docs/cpf_fernanda.pdf', uploadedAt: new Date('2024-10-27'), status: 'presente' },
      { id: 'ds8', type: 'rgp', name: 'RGP_Fernanda.pdf', url: '/docs/rgp_fernanda.pdf', uploadedAt: new Date('2024-10-27'), status: 'presente' },
    ],
    createdAt: new Date('2024-10-27'),
    updatedAt: new Date('2024-10-27'),
    priority: 'media',
  },
  {
    id: 's3',
    pescador: {
      id: 'ps3',
      nome: 'Antonio Silva Ribeiro',
      cpf: '333.444.555-66',
      rg: '33.444.555-6',
      dataNascimento: new Date('1970-02-14'),
      endereco: 'Rua das Redes, 234, Mongaguá',
      colonia: 'Z-12 Mongaguá',
      rgpNumero: 'SP-333444',
      rgpDataEmissao: new Date('2020-07-15'),
      telefone: '(13) 97003-3344',
    },
    status: 'documentacao_incompleta',
    documents: [
      { id: 'ds9', type: 'rg', name: 'RG_Antonio.pdf', url: '/docs/rg_antonio.pdf', uploadedAt: new Date('2024-10-20'), status: 'presente' },
      { id: 'ds10', type: 'cpf', name: 'CPF_Antonio.pdf', url: '/docs/cpf_antonio.pdf', uploadedAt: new Date('2024-10-20'), status: 'presente' },
      { id: 'ds11', type: 'rgp', name: 'RGP_Antonio.pdf', url: '/docs/rgp_antonio.pdf', uploadedAt: new Date('2024-10-20'), status: 'presente' },
    ],
    analysis: {
      id: 'as3',
      caseId: 's3',
      score: 55,
      eligibilityChecks: [
        { criterion: 'Documentos básicos apresentados', status: 'approved', details: 'RG e CPF presentes' },
        { criterion: 'RGP válido', status: 'approved', details: 'RGP ativo' },
        { criterion: 'Comprovação de atividade pesqueira', status: 'rejected', details: 'Sem comprovantes de venda' },
        { criterion: 'Vínculo com Colônia', status: 'rejected', details: 'Declaração da Colônia ausente' },
      ],
      missingDocuments: ['comprovante_venda', 'declaracao_colonia', 'comprovante_residencia'],
      inconsistencies: ['Falta comprovação de atividade pesqueira'],
      recommendations: ['Solicitar comprovantes de venda', 'Obter declaração da Colônia Z-12'],
      analyzedAt: new Date('2024-10-21'),
      aiConfidence: 78,
    },
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-21'),
    priority: 'media',
    lawyerNotes: 'Cliente notificado sobre documentos faltantes.',
  },
  {
    id: 's4',
    pescador: {
      id: 'ps4',
      nome: 'Camila Ferreira Costa',
      cpf: '444.555.666-77',
      rg: '44.555.666-7',
      dataNascimento: new Date('1995-09-25'),
      endereco: 'Rua Marítima, 567, Peruíbe',
      colonia: 'Z-13 Peruíbe',
      rgpNumero: 'SP-444555',
      rgpDataEmissao: new Date('2022-04-20'),
      telefone: '(13) 96004-4455',
    },
    status: 'reprovada',
    documents: [
      { id: 'ds12', type: 'rg', name: 'RG_Camila.pdf', url: '/docs/rg_camila.pdf', uploadedAt: new Date('2024-10-10'), status: 'presente' },
      { id: 'ds13', type: 'cpf', name: 'CPF_Camila.pdf', url: '/docs/cpf_camila.pdf', uploadedAt: new Date('2024-10-10'), status: 'presente' },
      { id: 'ds14', type: 'rgp', name: 'RGP_Camila.pdf', url: '/docs/rgp_camila.pdf', uploadedAt: new Date('2024-10-10'), status: 'invalido' },
    ],
    analysis: {
      id: 'as4',
      caseId: 's4',
      score: 25,
      eligibilityChecks: [
        { criterion: 'Documentos básicos apresentados', status: 'approved', details: 'RG e CPF presentes' },
        { criterion: 'RGP válido', status: 'rejected', details: 'RGP emitido há menos de 1 ano' },
        { criterion: 'Comprovação de atividade pesqueira', status: 'rejected', details: 'Sem comprovantes' },
        { criterion: 'Vínculo com Colônia', status: 'rejected', details: 'Sem declaração' },
      ],
      missingDocuments: ['comprovante_venda', 'declaracao_colonia'],
      inconsistencies: ['RGP emitido em 2022, não atende requisito mínimo de 1 ano'],
      recommendations: ['Caso não elegível', 'RGP muito recente', 'Aguardar completar 1 ano de registro'],
      analyzedAt: new Date('2024-10-11'),
      aiConfidence: 88,
    },
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-11'),
    priority: 'baixa',
    lawyerNotes: 'Cliente informado que não atende requisitos. Orientado a aguardar 1 ano de RGP.',
  },
  {
    id: 's5',
    pescador: {
      id: 'ps5',
      nome: 'Ricardo Oliveira Souza',
      cpf: '555.666.777-88',
      rg: '55.666.777-8',
      dataNascimento: new Date('1982-12-03'),
      endereco: 'Av. Oceânica, 890, Guarujá',
      colonia: 'Z-10 Santos',
      telefone: '(13) 95005-5566',
    },
    status: 'pendente',
    documents: [],
    createdAt: new Date('2024-10-28'),
    updatedAt: new Date('2024-10-28'),
    priority: 'baixa',
  },
  {
    id: 's6',
    pescador: {
      id: 'ps6',
      nome: 'Patricia Almeida Rocha',
      cpf: '666.777.888-99',
      rg: '66.777.888-9',
      dataNascimento: new Date('1991-06-17'),
      endereco: 'Rua dos Pescadores, 123, Santos',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-666777',
      rgpDataEmissao: new Date('2019-10-05'),
      telefone: '(13) 94006-6677',
    },
    status: 'aprovada',
    documents: [
      { id: 'ds15', type: 'rg', name: 'RG_Patricia.pdf', url: '/docs/rg_patricia.pdf', uploadedAt: new Date('2024-10-12'), status: 'presente' },
      { id: 'ds16', type: 'cpf', name: 'CPF_Patricia.pdf', url: '/docs/cpf_patricia.pdf', uploadedAt: new Date('2024-10-12'), status: 'presente' },
      { id: 'ds17', type: 'rgp', name: 'RGP_Patricia.pdf', url: '/docs/rgp_patricia.pdf', uploadedAt: new Date('2024-10-12'), status: 'presente' },
      { id: 'ds18', type: 'declaracao_colonia', name: 'Declaracao_Patricia.pdf', url: '/docs/dec_patricia.pdf', uploadedAt: new Date('2024-10-12'), status: 'presente' },
      { id: 'ds19', type: 'comprovante_venda', name: 'Vendas_Patricia.pdf', url: '/docs/vendas_patricia.pdf', uploadedAt: new Date('2024-10-12'), status: 'presente' },
    ],
    analysis: {
      id: 'as6',
      caseId: 's6',
      score: 92,
      eligibilityChecks: [
        { criterion: 'Documentos básicos apresentados', status: 'approved', details: 'RG e CPF presentes' },
        { criterion: 'RGP válido', status: 'approved', details: 'RGP ativo desde 2019' },
        { criterion: 'Comprovação de atividade pesqueira', status: 'approved', details: 'Comprovantes de venda completos' },
        { criterion: 'Vínculo com Colônia', status: 'approved', details: 'Declaração Z-10 presente' },
      ],
      missingDocuments: [],
      inconsistencies: [],
      recommendations: ['Excelente documentação', 'Pronta para abertura de processo'],
      analyzedAt: new Date('2024-10-13'),
      aiConfidence: 94,
    },
    createdAt: new Date('2024-10-12'),
    updatedAt: new Date('2024-10-13'),
    priority: 'alta',
  },
];

// Dados mockados de Processos Judiciais
export const mockProcessos: Processo[] = [
  {
    id: 'pr1',
    pescador: {
      id: 'pp1',
      nome: 'João da Silva Santos',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      dataNascimento: new Date('1975-03-15'),
      endereco: 'Rua das Ostras, 123, Praia Grande',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-123456',
      rgpDataEmissao: new Date('2020-01-10'),
      telefone: '(13) 98765-4321',
      email: 'joao.silva@email.com',
    },
    status: 'deferido',
    documents: [
      { id: 'dp1', type: 'rg', name: 'RG_Joao.pdf', url: '/docs/rg_joao.pdf', uploadedAt: new Date('2024-08-01'), status: 'presente' },
      { id: 'dp2', type: 'cpf', name: 'CPF_Joao.pdf', url: '/docs/cpf_joao.pdf', uploadedAt: new Date('2024-08-01'), status: 'presente' },
      { id: 'dp3', type: 'rgp', name: 'RGP_Joao.pdf', url: '/docs/rgp_joao.pdf', uploadedAt: new Date('2024-08-01'), status: 'presente' },
    ],
    numeroProcesso: '0001234-56.2024.8.26.0554',
    tribunal: 'TJSP',
    orgaoJulgador: '2ª Vara Cível de Praia Grande',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso',
    situacao: 'Sentença favorável',
    dataAjuizamento: new Date('2024-08-05'),
    movimentacoes: 15,
    ultimaMovimentacao: new Date('2024-10-20'),
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-10-20'),
    priority: 'media',
    solicitacaoId: 's1',
    lawyerNotes: 'Processo deferido. Cliente pode receber o benefício.',
  },
  {
    id: 'pr2',
    pescador: {
      id: 'pp2',
      nome: 'Maria Oliveira Silva',
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      dataNascimento: new Date('1982-07-22'),
      endereco: 'Av. Beira Mar, 456, Guarujá',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-987654',
      rgpDataEmissao: new Date('2021-06-15'),
      telefone: '(13) 99876-5432',
    },
    status: 'em_andamento',
    documents: [
      { id: 'dp4', type: 'rg', name: 'RG_Maria.pdf', url: '/docs/rg_maria.pdf', uploadedAt: new Date('2024-09-10'), status: 'presente' },
      { id: 'dp5', type: 'cpf', name: 'CPF_Maria.pdf', url: '/docs/cpf_maria.pdf', uploadedAt: new Date('2024-09-10'), status: 'presente' },
      { id: 'dp6', type: 'rgp', name: 'RGP_Maria.pdf', url: '/docs/rgp_maria.pdf', uploadedAt: new Date('2024-09-10'), status: 'presente' },
    ],
    numeroProcesso: '0002345-67.2024.8.26.0223',
    tribunal: 'TJSP',
    orgaoJulgador: '1ª Vara Cível do Guarujá',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso',
    situacao: 'Em tramitação',
    dataAjuizamento: new Date('2024-09-15'),
    movimentacoes: 8,
    ultimaMovimentacao: new Date('2024-10-26'),
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-10-26'),
    priority: 'alta',
  },
  {
    id: 'pr3',
    pescador: {
      id: 'pp3',
      nome: 'Carlos Mendes Pereira',
      cpf: '456.789.123-00',
      rg: '45.678.912-3',
      dataNascimento: new Date('1968-10-30'),
      endereco: 'Rua dos Navegantes, 789, Bertioga',
      colonia: 'Z-11 Bertioga',
      rgpNumero: 'SP-456789',
      rgpDataEmissao: new Date('2018-03-20'),
      telefone: '(13) 97654-3210',
    },
    status: 'aguardando_documentos',
    documents: [
      { id: 'dp7', type: 'rg', name: 'RG_Carlos.pdf', url: '/docs/rg_carlos.pdf', uploadedAt: new Date('2024-10-01'), status: 'presente' },
      { id: 'dp8', type: 'cpf', name: 'CPF_Carlos.pdf', url: '/docs/cpf_carlos.pdf', uploadedAt: new Date('2024-10-01'), status: 'presente' },
    ],
    numeroProcesso: '0003456-78.2024.8.26.0077',
    tribunal: 'TJSP',
    orgaoJulgador: 'Vara Única de Bertioga',
    classeProcessual: 'Mandado de Segurança',
    assunto: 'Seguro-Defeso',
    situacao: 'Aguardando documentos complementares',
    dataAjuizamento: new Date('2024-10-05'),
    movimentacoes: 5,
    ultimaMovimentacao: new Date('2024-10-25'),
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-25'),
    priority: 'alta',
    lawyerNotes: 'Tribunal solicitou comprovantes de venda adicionais.',
  },
  {
    id: 'pr4',
    pescador: {
      id: 'pp4',
      nome: 'Roberto Alves Ferreira',
      cpf: '159.753.486-00',
      rg: '15.975.348-6',
      dataNascimento: new Date('1972-09-08'),
      endereco: 'Rua da Praia, 321, Peruíbe',
      colonia: 'Z-13 Peruíbe',
      rgpNumero: 'SP-951753',
      rgpDataEmissao: new Date('2019-08-12'),
      telefone: '(13) 94321-0987',
    },
    status: 'indeferido',
    documents: [
      { id: 'dp9', type: 'rg', name: 'RG_Roberto.pdf', url: '/docs/rg_roberto.pdf', uploadedAt: new Date('2024-09-01'), status: 'presente' },
      { id: 'dp10', type: 'cpf', name: 'CPF_Roberto.pdf', url: '/docs/cpf_roberto.pdf', uploadedAt: new Date('2024-09-01'), status: 'presente' },
    ],
    numeroProcesso: '0004567-89.2024.8.26.0445',
    tribunal: 'TJSP',
    orgaoJulgador: '1ª Vara Cível de Peruíbe',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso',
    situacao: 'Sentença indeferida',
    dataAjuizamento: new Date('2024-09-05'),
    movimentacoes: 12,
    ultimaMovimentacao: new Date('2024-10-15'),
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-15'),
    priority: 'baixa',
    lawyerNotes: 'Processo indeferido por vínculo empregatício CLT ativo.',
  },
  {
    id: 'pr5',
    pescador: {
      id: 'pp5',
      nome: 'Sandra Regina Almeida',
      cpf: '951.357.852-00',
      rg: '95.135.785-2',
      dataNascimento: new Date('1983-03-11'),
      endereco: 'Rua Coral, 55, Santos',
      colonia: 'Z-10 Santos',
      rgpNumero: 'SP-951357',
      rgpDataEmissao: new Date('2019-05-22'),
      telefone: '(13) 94321-5555',
    },
    status: 'deferido',
    documents: [
      { id: 'dp11', type: 'rg', name: 'RG_Sandra.pdf', url: '/docs/rg_sandra.pdf', uploadedAt: new Date('2024-08-15'), status: 'presente' },
      { id: 'dp12', type: 'cpf', name: 'CPF_Sandra.pdf', url: '/docs/cpf_sandra.pdf', uploadedAt: new Date('2024-08-15'), status: 'presente' },
      { id: 'dp13', type: 'rgp', name: 'RGP_Sandra.pdf', url: '/docs/rgp_sandra.pdf', uploadedAt: new Date('2024-08-15'), status: 'presente' },
    ],
    numeroProcesso: '0005678-90.2024.8.26.0562',
    tribunal: 'TJSP',
    orgaoJulgador: '1ª Vara Cível de Santos',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Seguro-Defeso',
    situacao: 'Sentença favorável',
    dataAjuizamento: new Date('2024-08-20'),
    movimentacoes: 10,
    ultimaMovimentacao: new Date('2024-10-10'),
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-10-10'),
    priority: 'media',
    solicitacaoId: 's6',
  },
];
