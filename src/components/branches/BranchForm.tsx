'use client';

import React, { useState, useEffect } from 'react';
import { Branch } from '@/entities/branches/Branch';
import styles from './BranchForm.module.css';

interface BranchFormProps {
    branch?: Branch; // If provided, it's an edit form
    onSubmit: (data: Partial<Branch>) => void;
    onCancel: () => void;
}

export default function BranchForm({ branch, onSubmit, onCancel }: BranchFormProps) {
    const [formData, setFormData] = useState<Partial<Branch>>({
        name: '',
        address: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (branch) {
            setFormData({
                name: branch.name,
                address: branch.address,
                email: branch.email || '',
                phoneNumber: branch.phoneNumber || ''
            });
        }
    }, [branch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Nome da Filial</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Filial Centro"
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

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">E-mail (opcional)</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="filial@email.com"
                    />
                </div>

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
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    {branch ? 'Salvar Edição' : 'Cadastrar Filial'}
                </button>
            </div>
        </form>
    );
}
