"use client";

import { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { Tweet as TweetType } from "react-tweet/api";
import extractTweetId from "@/lib/helpers/extract-tweet-id";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TweetFormProps {
  tweetData: TweetType | null;
  setTweetData: Dispatch<SetStateAction<TweetType | null>>;
}

export default function TweetForm({ tweetData, setTweetData }: TweetFormProps) {
  const [tweet, setTweet] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tweetId = extractTweetId(tweet);

    if (tweetId) {
      try {
        const response = await fetch(`/api/tweet?tweetId=${tweetId}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else if (data.tweet) {
          setTweetData(data.tweet);
          setError(null);
        }
      } catch (err) {
        setError("An error occurred while fetching the tweet.");
      }
    } else {
      setError("Invalid tweet URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tweetUrl">Tweet URL</Label>
        <Input
          type="text"
          id="tweetUrl"
          name="tweetUrl"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          required
          placeholder="https://twitter.com/username/status/1234567890"
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit">Analyze Tweet</Button>
    </form>
  );
}
