// src/hooks/useAsyncStorage.ts

import { useEffect, useState } from 'react'; // React-хуки для состояния и эффектов
import { getItem, setItem } from '../services/storage'; // Асинхронные функции работы с хранилищем

export function useAsyncStorage<T>(key: string, initial: T) { // Хук принимает ключ и начальное значение
  const [state, setState] = useState<T>(initial); // Текущее значение состояния
  const [loading, setLoading] = useState(true);   // Флаг загрузки из хранилища

  useEffect(() => {               // Эффект для чтения данных из хранилища
    let mounted = true;           // Флаг для предотвращения обновления после unmount

    (async () => {                // Асинхронная самовызывающаяся функция
      try {
        const stored = await getItem(key); // Получаем данные из хранилища по ключу
        if (mounted && stored !== null) {  // Если компонент ещё существует и данные есть —
          setState(stored);                // обновляем состояние
        }
      } catch (e) { /* ignore */ }         // Ошибки тихо игнорируем
      finally {
        if (mounted) setLoading(false);    // В любом случае завершаем загрузку
      }
    })();

    return () => { mounted = false; };     // Очищаем флаг при размонтировании
  }, [key]);                               // Выполняем эффект, если изменился ключ

  const save = async (v: T) => { // Функция обновления значения
    setState(v);                 // Обновляем реактивное состояние
    await setItem(key, v);       // Сохраняем в асинхронное хранилище
  };

  return { state, setState: save, loading }; // Возвращаем интерфейс хука
}
