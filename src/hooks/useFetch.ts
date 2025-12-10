// src/hooks/useFetch.ts

import { useEffect, useState } from 'react'; // Импортируем хуки React
import { apiGet } from '../services/api';   // Функция GET-запроса

export function useFetch<T = any>(path: string | null) { // Хук для загрузки данных по API
  const [data, setData] = useState<T | null>(null);      // Храним полученные данные
  const [loading, setLoading] = useState(false);         // Индикатор загрузки
  const [error, setError] = useState<Error | null>(null);// Храним ошибку, если она возникла

  useEffect(() => {                 // Эффект вызывается при изменении path
    if (!path) return;              // Если путь пустой — ничего не делаем

    let mounted = true;             // Флаг, чтобы не обновлять состояние после unmount
    setLoading(true);               // Включаем индикатор загрузки

    apiGet(path)                    // Отправляем GET-запрос
      .then(res => { 
        if (mounted) setData(res);  // Сохраняем данные, если компонент ещё на странице
      })
      .catch(err => { 
        if (mounted) setError(err); // Сохраняем ошибку, если компонент не размонтирован
      })
      .finally(() => {
        if (mounted) setLoading(false); // Отключаем загрузку после запроса
      });

    return () => { mounted = false; }; // Cleanup: помечаем как размонтированный
  }, [path]);                           // Запускаем эффект при изменении path

  return { data, loading, error };      // Возвращаем результат работы хука
}
