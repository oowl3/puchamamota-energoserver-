"use client"
import React, { useState } from 'react';
import Header_home from '@/app/components/elements/header/Header_home';
import Footer_home from '../components/elements/footer/Footer_home';
import { ThemeToggle } from '../components/ThemeToggle';
import faqData from './faq.json'; 
import FollowCursor from '../components/elements/follows/Follow_basic';
import Header_menu from '../components/elements/header/Header_menu';

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFaqs = faqData.filter(({ question, answer }) => {
    const searchString = `${question} ${answer}`.toLowerCase();
    return searchString.includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div className="pt-12 max-w-4xl mx-auto min-h-screen flex flex-col">
      <Header_menu />
      <FollowCursor/> 
        <main className="flex-grow px-4">
          <h1 className="text-3xl mt-6 mb-4 font-urbanist font-medium">
            Preguntas Frecuentes
          </h1>


          <div className="mb-4 w-full max-w-[500px] relative">
            <label htmlFor="searchInput" className="sr-only">
              Buscar en preguntas frecuentes
            </label>
            <span className="material-icons text-[var(--color-v-1)] absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              id="searchInput"
              type="search"
              placeholder="Buscar en preguntas..."
              className="w-full pl-10 p-3 rounded-lg border focus:outline-none transition-all"
              style={{ borderColor: "var(--color-v-2)" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-controls="faqList"
            />
          </div>

          <hr className="mb-6 border-gray-300" />

          {/* Lista de resultados */}
          <ul 
            id="faqList"
            className="space-y-6 mb-8"
            aria-live="polite"
            aria-atomic="true"
          >
            {filteredFaqs.map((faq, index) => (
              <li
                key={`faq-${index}-${faq.question.slice(0,5)}`}
                className="rounded-sm p-4 hover:shadow-sm transition-shadow"
                style={{
                  borderWidth: "0.1rem",
                  borderColor: "var(--color-v-2)",
                  backgroundColor: "var(--color-bg)"
                }}
              >
                <article>
                  <h2 className="text-lg font-urbanist font-medium text-[var(--color-text)]">
                    {faq.question}
                  </h2>
                  <div 
                    className="w-full h-px my-2" 
                    style={{ backgroundColor: 'var(--color-v-2)' }} 
                    aria-hidden="true"
                  />
                  <p className="text-[var(--color-text)] mt-1">{faq.answer}</p>
                </article>
              </li>
            ))}

            {/* Estado vacío */}
            {filteredFaqs.length === 0 && (
              <li 
                className="text-center py-6 text-gray-500 italic"
                aria-live="assertive"
              >
                No se encontraron resultados para &quot;{searchQuery}&quot;
              </li>
            )}
          </ul>
        </main>

        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
        <Footer_home />

    </div>
  );
};

export default Questions;