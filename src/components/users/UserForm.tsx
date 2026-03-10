'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/entities/users/User';
import styles from './UserForm.module.css';

interface UserFormProps {
  user?: User; // If provided, it's an edit form
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    taxIdentification: '',
    phoneNumber: '',
    role: 'STOCKIST'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        taxIdentification: user.taxIdentification,
        phoneNumber: user.phoneNumber || '',
        role: user.role
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <label htmlFor="name">Nome Completo</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: João Silva"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="exemplo@email.com"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="taxIdentification">CPF ou CNPJ</label>
          <input
            id="taxIdentification"
            name="taxIdentification"
            type="text"
            value={formData.taxIdentification}
            onChange={handleChange}
            required
            placeholder="Apenas números"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="role">Cargo / Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} required>
            <option value="STOCKIST">Estoquista (STOCKIST)</option>
            <option value="ADMIN">Administrador (ADMIN)</option>
          </select>
        </div>
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

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className={styles.submitBtn}>
          {user ? 'Salvar Edição' : 'Cadastrar Usuário'}
        </button>
      </div>
    </form>
  );
}
