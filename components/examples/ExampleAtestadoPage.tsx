import React from 'react';
import { CreateAtestadoForm } from '@/components/CreateAtestadoForm';
import { useRouter } from 'next/navigation';

export default function ExampleAtestadoPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to atestados list or show success message
    router.push('/dashboard/atestados');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Criar Novo Atestado
        </h1>

        <CreateAtestadoForm onSuccess={handleSuccess} />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Preencha todos os campos obrigatórios e anexe a imagem do atestado médico.
          </p>
          <p>
            O atestado será enviado para análise e você receberá uma confirmação em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
