-- Migration: 006_add_criado_tardio_to_atestados.sql
-- Adiciona a coluna criado_tardio à tabela atestados para marcar atestados enviados após 5 dias da data de início.

BEGIN;

-- Adicionar coluna criado_tardio (boolean, default false para registros existentes)
ALTER TABLE public.atestados
  ADD COLUMN IF NOT EXISTS criado_tardio BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.atestados.criado_tardio IS 'Indica se o atestado foi criado/enviado após 5 dias da data de início do afastamento';

COMMIT;
