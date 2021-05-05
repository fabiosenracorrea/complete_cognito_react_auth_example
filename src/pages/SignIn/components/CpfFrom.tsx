import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import { useAuth } from '../../../hooks/Auth';

import { validateCPF } from '../../../services/cpfAPi'

import { Form, Loader, FormButton } from '../styles';

const CPF_LENGTH = 11;

const CpfForm: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveCPF } = useAuth();

  const handleCPFValidation = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (cpf.length !== CPF_LENGTH) return;

      setLoading(true);

      const validCPF = await validateCPF(cpf);

      setLoading(false)

      if (!validCPF) return alert('CPF Not authorized!');

      saveCPF(cpf)
    },
    [cpf, saveCPF],
  );

  const handleCPFInput = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value: possibleNewCPFValue } = target;

    const numberRegex = /^[0-9]*$/g;

    const inLengthRange = possibleNewCPFValue.length <= 11;
    const onlyNumbers = numberRegex.test(possibleNewCPFValue);

    if (onlyNumbers && inLengthRange) setCpf(possibleNewCPFValue)
  }, [])

  return (
    <Form onSubmit={handleCPFValidation}>
      <h4>Por favor, insira o seu CPF</h4>
      <input
        type="text"
        name="cpf"
        placeholder="cpf (apenas números)"
        value={cpf}
        onChange={handleCPFInput}
        required
      />
      <FormButton type="submit" disabled={loading} $loading={loading}>
        {loading && <div />}
        Prosseguir
        {loading && <Loader />}
      </FormButton>
    </Form>
  );
};

export default CpfForm;
