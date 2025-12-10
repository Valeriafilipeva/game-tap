// src/hooks/useInterval.ts

import { useEffect, useRef } from 'react'; // Импортируем хуки React

export function useInterval(callback: () => void, delay: number | null) { // Хук принимает функцию и время задержки

  const saved = useRef(callback); // Храним последнюю версию callback, чтобы избежать устаревших данных

  useEffect(() => {
    saved.current = callback;     // Обновляем ref при каждом изменении callback
  }, [callback]);

  useEffect(() => {               // Эффект отвечает за запуск/перезапуск интервала
    if (delay === null) return;   // Если delay = null → интервал не запускаем (пауза)

    const id = setInterval(() => saved.current(), delay); // Выполняем сохраненный callback по интервалу

    return () => clearInterval(id); // Очистка интервала при размонтировании или обновлении delay
  }, [delay]);                     // Перезапускать интервал только если delay изменился
}
