export interface Customer{
id: number; 
name: string; 
address: string; 
city: string; 
activeOrderCount: number; // i added this so i can prevent the deletion of a customer if have one or more active orders
}

// so we make the typing for creation
export interface CustomerRequest {
  name: string;
  address: string;
  city: string;
}