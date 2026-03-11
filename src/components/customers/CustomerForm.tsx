'use client';

import React, { useState, useEffect } from 'react';
import { Customer } from '@/entities/customers/Customer';
import styles from './CustomerForm.module.css';

interface CustomerFormProps {
    customer?: Customer; // If provided, it's an edit form
    onSubmit: (data: Partial<Customer>) => void;
    onCancel: () => void;
}

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '',
        address: '',
        email: '',
        phoneNumber: '',
        debt: 0
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                address: customer.address || '',
                email: customer.email || '',
                phoneNumber: customer.phoneNumber || '',
                debt: Number(customer.debt)
            });
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Nome do Cliente</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: João da Silva"
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="address">Endereço</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="email">E-mail (opcional)</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="cliente@email.com"
                />
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">Telefone (opcional)</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber || ''}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="debt">Dívida (R$)</label>
                    <input
                        id="debt"
                        name="debt"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.debt as any}
                        onChange={handleChange}
                        placeholder="0,00"
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    {customer ? 'Salvar Edição' : 'Cadastrar Cliente'}
                </button>
            </div>
        </form>
    );
}
