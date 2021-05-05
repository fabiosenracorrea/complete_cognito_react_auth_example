import { Auth } from 'aws-amplify'

import oncoImg from '../../assets/logos-unidades-oc-recife.png';

function GenericPage() {
  return (
    <div className="content">
      <img src={oncoImg} alt="onco clinicas"/>

      <h2>LANDING PAGE</h2>

      <button type="button" onClick={() => Auth.federatedSignIn()}>Fazer login</button>

      <button type="button" onClick={() => Auth.federatedSignIn({
        provider: 'Facebook' as any
      })}>Facebook Login</button>

      <button type="button" onClick={() => Auth.federatedSignIn({
        provider: 'Google' as any
      })}>Google Login</button>

      <button type="button" onClick={() => Auth.federatedSignIn({
        provider: 'Rede-Corporativa' as any
      })}>Private Network</button>
    </div>
  )
}

export default GenericPage;
