'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/entities/products/Product';
import SupplierSelectionModal from './SupplierSelectionModal';
import styles from './ProductForm.module.css';

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        remarks: '',
        purchasePrice: 0,
        retailPrice: 0,
        supplierIds: [] as string[]
    });

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                remarks: product.remarks || '',
                purchasePrice: Number(product.purchasePrice),
                retailPrice: Number(product.retailPrice),
                supplierIds: product.suppliers?.map(s => s.id) || []
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Nome do Produto</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Coca-Cola 2L"
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="description">Descrição</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Breve descrição do produto..."
                    rows={2}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="purchasePrice">Preço de Compra (R$)</label>
                    <input
                        id="purchasePrice"
                        name="purchasePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="retailPrice">Preço de Venda (R$)</label>
                    <input
                        id="retailPrice"
                        name="retailPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.retailPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>Fornecedores</label>
                <div className={styles.supplierSelector}>
                    <button
                        type="button"
                        className={styles.selectBtn}
                        onClick={() => setIsSupplierModalOpen(true)}
                    >
                        {formData.supplierIds.length > 0
                            ? `${formData.supplierIds.length} fornecedor(es) selecionado(s)`
                            : 'Selecionar Fornecedores'}
                    </button>
                    {formData.supplierIds.length > 0 && (
                        <span className={styles.supplierHint}>Clique para alterar</span>
                    )}
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="remarks">Observações Internas</label>
                <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Notas internas ou observações..."
                    rows={2}
                />
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    {product ? 'Salvar Edição' : 'Cadastrar Produto'}
                </button>
            </div>
        </form>

        <SupplierSelectionModal
            isOpen={isSupplierModalOpen}
            onClose={() => setIsSupplierModalOpen(false)}
            selectedSupplierIds={formData.supplierIds}
            onSelect={(ids) => setFormData(prev => ({ ...prev, supplierIds: ids }))}
        />
        </>
    );
}
