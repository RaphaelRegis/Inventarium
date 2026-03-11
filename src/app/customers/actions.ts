'use server';

import { CustomerRepositoryImpl } from '@/repositories/customers/CustomerRepositoryImpl';
import { GetAllCustomersUseCase } from '@/services/customers/GetAllCustomersUseCase';
import { CreateCustomerUseCase } from '@/services/customers/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '@/services/customers/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '@/services/customers/DeleteCustomerUseCase';
import { Customer } from '@/entities/customers/Customer';
import { revalidatePath } from 'next/cache';

const customerRepository = new CustomerRepositoryImpl();

export async function fetchAllCustomers() {
    const useCase = new GetAllCustomersUseCase(customerRepository);
    return await useCase.execute();
}

export async function createCustomer(data: Partial<Customer>) {
    const useCase = new CreateCustomerUseCase(customerRepository);
    const customer = await useCase.execute(data as any);
    revalidatePath('/customers');
    return customer;
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
    const useCase = new UpdateCustomerUseCase(customerRepository);
    const customer = await useCase.execute({ id, ...data } as any);
    revalidatePath('/customers');
    return customer;
}

export async function deleteCustomer(id: string) {
    const useCase = new DeleteCustomerUseCase(customerRepository);
    await useCase.execute(id);
    revalidatePath('/customers');
}
