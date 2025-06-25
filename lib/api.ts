// lib/api.ts

export const fetchArticles = async (token: string) => {
  try {
    const res = await fetch('https://artiz-1ly2.onrender.com/api/admin/articles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Erreur lors de la récupération des articles.');

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur API fetchArticles:', error);
    return null;
  }
};
