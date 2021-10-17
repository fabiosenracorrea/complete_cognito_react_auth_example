export async function validateCPF(cpf: string): Promise<boolean> {
  const yesOrNo = Boolean(Math.round(Math.random()));

  return new Promise((resolve) => setTimeout(() => resolve(yesOrNo), 1000));
}
