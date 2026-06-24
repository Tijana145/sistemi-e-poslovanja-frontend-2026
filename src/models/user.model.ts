export interface Userodel{
  userId: number
  firstName: string
  lastName: string
  gender: 'm' | 'f'
  email: string
  invoices: 
    {
      invoiceId: number
      pursId: string
      pursTime: string
    }[]
  
}
