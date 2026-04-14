'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CustomerSelectionModal from '@/components/customers/CustomerSelectionModal';
import BranchSelectionModal from '@/components/products/BranchSelectionModal';
import BranchInventorySelectionModal from './BranchInventorySelectionModal';
import { Customer } from '@/entities/customers/Customer';
import { Inventory } from '@/entities/inventories/Inventory';
import * as customerActions from '@/app/customers/actions';
import * as branchActions from '@/app/branches/actions';
import styles from '@/components/product-entries/ProductEntryForm.module.css'; // Reusing CSS from entries

interface ProductOutputFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

interface OutputItem {
    inventory: Inventory;
    quantity: number;
    unitPrice: number;
}

export default function ProductOutputForm({ onSubmit, onCancel }: ProductOutputFormProps) {
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [branchId, setBranchId] = useState<string | null>(null);
    const [branchName, setBranchName] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<OutputItem[]>([]);

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

    useEffect(() => {
        if (customerId) {
            customerActions.fetchAllCustomers().then(customers => {
                const found = customers.find((c: any) => c.id === customerId);
                if (found) setCustomer(found as Customer);
            });
        } else {
            setCustomer(null);
        }
    }, [customerId]);

    useEffect(() => {
        if (branchId) {
            branchActions.fetchAllBranches().then(branches => {
                const found = branches.find((b: any) => b.id === branchId);
                if (found) setBranchName(found.name);
            });
            
            if (items.length > 0) {
                const confirmClear = window.confirm("Atenção: Ao mudar a filial, a lista de produtos será limpa. Continuar?");
                if (confirmClear) setItems([]);
            }
        }
    }, [branchId]);

    const handleAddInventory = (inventory: Inventory) => {
        if (!items.find(item => item.inventory.id === inventory.id)) {
            setItems(prev => [...prev, { 
                inventory, 
                quantity: 1,
                unitPrice: Number(inventory.product?.retailPrice || 0)
            }]);
        }
        setIsInventoryModalOpen(false);
    };

    const handleUpdateQuantity = (inventoryId: string, quantity: number) => {
        setItems(prev => prev.map(item => {
            if (item.inventory.id === inventoryId) {
                const max = item.inventory.quantity;
                const finalQ = Math.max(1, Math.min(quantity, max));
                return { ...item, quantity: finalQ };
            }
            return item;
        }));
    };

    const handleUpdatePrice = (inventoryId: string, price: number) => {
        setItems(prev => prev.map(item => 
            item.inventory.id === inventoryId ? { ...item, unitPrice: Math.max(0, price) } : item
        ));
    };

    const handleRemoveItem = (inventoryId: string) => {
        setItems(prev => prev.filter(item => item.inventory.id !== inventoryId));
    };

    const totalValue = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }, [items]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // customer is optional according to specs (sales to non-registered), but if your business forces it, require it.
        // Let's make it optional but warn maybe? Or strictly optionally if customerId=null
        if (!branchId) {
            alert('Selecione uma filial.');
            return;
        }
        if (items.length === 0) {
            alert('Adicione ao menos um produto para saída.');
            return;
        }

        const dateObj = new Date(date);
        
        onSubmit({
            customerId,
            branchId,
            date: dateObj,
            totalValue,
            items: items.map(item => ({
                productId: item.inventory.product?.id ?? '', // fallback to empty string if undefined (shouldnt happen in real cases)
                quantity: item.quantity,
                unitPrice: item.unitPrice
            }))
        });
    };

    return (
        <>
        <form className={styles.form} onSubmit={handleSubmit}>
            
            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Data de Saída</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Total Gasto</label>
                    <input 
                        type="text" 
                        value={formatCurrency(totalValue)} 
                        readOnly
                        style={{ fontWeight: 'bold', color: 'var(--success)'}}
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Cliente (Opcional)</label>
                    <div className={styles.selector}>
                        <button
                            type="button"
                            className={styles.selectBtn}
                            onClick={() => setIsCustomerModalOpen(true)}
                        >
                            {customer ? customer.name : 'Selecionar Cliente Avulso'}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Filial de Origem</label>
                    <div className={styles.selector}>
                        <button
                            type="button"
                            className={styles.selectBtn}
                            onClick={() => setIsBranchModalOpen(true)}
                        >
                            {branchId ? branchName : 'Selecionar Filial'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.itemsSection}>
                <div className={styles.itemsHeader}>
                    <h3>Produtos Retirados</h3>
                    <button 
                        type="button" 
                        className={styles.addBtn}
                        onClick={() => {
                            if (!branchId) {
                                alert("Selecione a filial origem primeiro.");
                                return;
                            }
                            setIsInventoryModalOpen(true);
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Adicionar
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className={styles.emptyItems}>
                        Nenhum produto adicionado.
                    </div>
                ) : (
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div key={item.inventory.id} className={styles.itemRow}>
                                <div className={styles.itemName}>
                                    {item.inventory.product?.name || 'Desconhecido'} 
                                    <span style={{fontSize: '0.7em', display: 'block', color: 'var(--gray-500)'}}> (Máx: {item.inventory.quantity}) </span>
                                </div>
                                
                                <div className={styles.itemQty} style={{ width: '80px'}}>
                                    <label style={{fontSize: '0.7rem'}}>Qtd</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        max={item.inventory.quantity}
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.inventory.id, parseInt(e.target.value) || 1)}
                                    />
                                </div>

                                <div className={styles.itemQty} style={{ width: '100px'}}>
                                    <label style={{fontSize: '0.7rem'}}>Preço Un. (R$)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        value={item.unitPrice}
                                        onChange={(e) => handleUpdatePrice(item.inventory.id, parseFloat(e.target.value) || 0)}
                                    />
                                </div>

                                <div className={styles.itemQty} style={{ width: '90px'}}>
                                    <label style={{fontSize: '0.7rem'}}>SubTotal</label>
                                    <div style={{fontWeight: 600, marginTop: '8px'}}>{formatCurrency(item.quantity * item.unitPrice)}</div>
                                </div>

                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    style={{marginTop: '15px'}}
                                    onClick={() => handleRemoveItem(item.inventory.id)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                    Registrar Saída
                </button>
            </div>
        </form>

        <CustomerSelectionModal
            isOpen={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            selectedCustomerIds={customerId ? [customerId] : []}
            onSelect={(ids) => {
                if (ids.length > 0) {
                    setCustomerId(ids[ids.length - 1]);
                } else {
                    setCustomerId(null);
                }
                setIsCustomerModalOpen(false);
            }}
        />

        <BranchSelectionModal
            isOpen={isBranchModalOpen}
            onClose={() => setIsBranchModalOpen(false)}
            selectedBranchIds={branchId ? [branchId] : []}
            onSelect={(ids) => {
                if (ids.length > 0) {
                    setBranchId(ids[ids.length - 1]);
                } else {
                    setBranchId(null);
                }
                setIsBranchModalOpen(false);
            }}
        />

        <BranchInventorySelectionModal
            isOpen={isInventoryModalOpen}
            onClose={() => setIsInventoryModalOpen(false)}
            branchId={branchId}
            onSelect={handleAddInventory}
        />
        </>
    );
}
