'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from './reviews-data-table';
import { GetAllReviews } from '@/actions/reviewActions';

import { Review } from '@prisma/client';
import { toast } from 'react-toastify';
import { reviewColumns } from './reviews-columns';

type ReviewData = Review & {
  tourTitle: string;
  // user: { name: string; email: string };
};


export default function ReviewsPage() {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
  
    const fetchReviews = useCallback(async () => {
      const response = await GetAllReviews();
      if (response.success && Array.isArray(response.data)) {
        setReviews(response.data as unknown as ReviewData[]);
      } else {
        toast.error('Failed to fetch reviews');
      }
    }, []);
    
    useEffect(() => {
      fetchReviews();
    }, [fetchReviews]);
  
    console.log('Reviews:', reviews);
  return (
    <div className=" mx-auto p-8 ">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Avis</h1>
      <p className="text-lg text-gray-600 mb-6">Ci-dessous la liste de tous les avis soumis.</p>
      <DataTable<ReviewData, unknown>
        columns={reviewColumns({ refresh: fetchReviews })}
        data={reviews}
      />
    </div>


  );
}