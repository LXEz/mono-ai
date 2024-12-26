'use client';

import ReloadIcon from '@/assets/images/icon-reload.svg';
import CloseIcon from '@/assets/images/icon-close.svg';
import { useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default function Golf() {
  const [loading, setLoading] = useState(true);

  const getConfigs = async () => {
    try {
      const res = await fetch('/api/configs');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      // error handler
    } finally {
      setLoading(false);
    }
  };

  const chat = async () => {
    try {
      const ctrl = new AbortController();

      await fetchEventSource('/api/chats/streaming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'hello',
          history: [],
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onopen: async (response) => {
          if (response.ok) {
          } else {
            ctrl.abort();
            throw new Error();
          }
        },
        onmessage: (event) => {},
        onerror: (err) => {
          ctrl.abort();
          throw new Error();
        },
      });
    } catch (err) {
      // error handler
    } finally {
    }
  };

  const feedback = async () => {
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          'messageId': 1,
          'comment': 'string',
          'isLike': true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      // error handler
    } finally {
      setLoading(false);
    }
  };

  const updateResponseTime = async () => {
    try {
      const res = await fetch('/api/chats/messages/1/times', {
        method: 'POST',
        body: JSON.stringify({
          'chatRequestDate': '2024-11-09T12:38:44.643Z',
          'chatResponseDate': '2024-11-09T12:38:44.643Z',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      // error handler
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //getConfigs();
    //chat();
    //feedback();
    updateResponseTime();
  }, []);

  return (
    <div className="w-full h-[100dvh] flex overflow-hidden font-InterRegular">
      <div className="w-full flex-1 relative bg-transparent">
        <div className="h-14 flex justify-between items-center p-4 border-b-[1px] border-solid border-[#E0E5EA]">
          <button className="w-6 h-6">
            <ReloadIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <div className="border-[1px] border-solid border-black text-black rounded-3xl px-[6px] py-[2px] mr-2 text-[12px]">
              Beta
            </div>
            <div className="max-w-[calc(100vw-160px)] text-[16px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap text-[#e74955]">
              T-Avatar
            </div>
          </div>
          <button className="ukvi-action">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-transparent">
          <div className="overflow-hidden overflow-y-auto pb-[30px] h-[calc(100dvh-77px-15px-70px)"></div>
        </div>
      </div>
    </div>
  );
}
