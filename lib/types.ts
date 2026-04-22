export type Provider = {
  id: string
  name: string
}

export type Shop = {
  id: string
  name: string
  description: string
  providers: Provider[]
}

export type SessionPayload = {
  userId: string
  email: string
  name: string
}
