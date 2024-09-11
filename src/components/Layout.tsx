'use client';

import React from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import Wallet from './Wallet';
import Providers from '@/app/providers/Providers';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Providers>
            <div className="layout">
                <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
                    <h1>TicketKit</h1>
                    <nav className="flex gap-4">
                        <Link href="/creator-dashboard" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                            I'm a creator
                        </Link>
                        <Wallet />
                        <LogoutButton />
                    </nav>
                </header>
                <main>
                    {children}
                </main>
                <footer>
                    <p>&copy; 2024 Event Management</p>
                </footer>
            </div>
        </Providers>
    );
};

export default Layout;