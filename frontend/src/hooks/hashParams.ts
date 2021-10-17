import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';

interface HashParams {
  [key: string]: string;
}

const QUESTION_MARK = '?';

export function useHashParams(): HashParams {
  const { hash } = useLocation();
  const { replace } = useHistory();

  const [queryParams] = useState(() => {
    const startingHashtag = /^#/;

    const hashAsSearch = hash.replace(startingHashtag, QUESTION_MARK)

    const searchParams = new URLSearchParams(hashAsSearch);

    const searchAsArray = Array.from(searchParams.entries());

    const params = searchAsArray.reduce((accParams, [key, value]) => ({
      ...accParams,
      [key]: value,
    }), {} as HashParams);

    return params;
  });

  useEffect(() => replace({ hash: '' }), []); // eslint-disable-line

  return queryParams;
}
