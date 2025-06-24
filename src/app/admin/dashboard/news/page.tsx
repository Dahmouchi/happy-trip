/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from './news-data-table';

import { toast } from 'react-toastify';
import { reviewColumns } from './news-columns';
import { GetAllNews } from '@/actions/saveLandingConfig';

export default function ReviewsPage() {
    const [news, setNews] = useState<any[]>([]);

    const fetchReviews = useCallback(async () => {
      const response = await GetAllNews();
      if (response.success && Array.isArray(response.data)) {
        setNews(response.data as unknown as any[]);
      } else {
        toast.error('Failed to fetch reviews');
      }
    }, []);
    
    useEffect(() => {
      fetchReviews();
    }, [fetchReviews]);
  
    console.log('Reviews:', news);
  return (
    <div className=" mx-auto p-8 ">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">NewsLetter</h1>
      <p className="text-lg text-gray-600 mb-6">Ci-dessous la liste de tous les NewsLetters soumis.</p>
      <DataTable<any, unknown>
        columns={reviewColumns({ refresh: fetchReviews })}
        data={news}
      />
    </div>


  );
}