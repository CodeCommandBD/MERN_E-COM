"use client";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const optionsString = JSON.stringify(options);
  const requestOptions = useMemo(() => {
    const opts = { ...options };
    if (method === "POST" && !opts.data) {
      opts.data = {};
    }
    // Add cache busting for GET requests
    if (method === "GET") {
      opts.params = { ...opts.params, _t: new Date().getTime() };
    }
    return opts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, optionsString, refreshIndex]);

  useEffect(() => {
    const apiCall = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        setData(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    apiCall();
  }, [url, refreshIndex, requestOptions, method]);

  const refetch = React.useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  return { data, loading, error, refetch };
};

export default useFetch;
