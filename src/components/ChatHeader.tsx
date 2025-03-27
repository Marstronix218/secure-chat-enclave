
import React from "react";

const ChatHeader: React.FC = () => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-medium tracking-tight">セキュアチャット</h2>
      <p className="text-sm text-muted-foreground mt-1">
        エンドツーエンド暗号化通信
      </p>
    </div>
  );
};

export default ChatHeader;
