
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/toast";
import AnimatedContainer from "./AnimatedContainer";
import { 
  FolderPlus, Key, Upload, Trash2, Download, Send, RefreshCw, Check
} from "lucide-react";
import {
  createKeyDirectory,
  retrieveServerKey,
  generateKey,
  sendPublicKeyB,
  encryptKeyA,
  sendEncryptedKeyA,
  deleteKey,
  deleteAllKeys
} from "@/lib/api";

interface KeyManagementProps {
  onClearChat: () => void;
}

const KeyManagement: React.FC<KeyManagementProps> = ({ onClearChat }) => {
  const [isKeyDirCreated, setIsKeyDirCreated] = useState(false);
  const [isServerKeyRetrieved, setIsServerKeyRetrieved] = useState(false);
  const [isKeyAGenerated, setIsKeyAGenerated] = useState(false);
  const [isKeyBGenerated, setIsKeyBGenerated] = useState(false);
  const [isKeyAEncrypted, setIsKeyAEncrypted] = useState(false);
  const [isKeyASent, setIsKeyASent] = useState(false);
  const [isKeyBSent, setIsKeyBSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");

  const handleCreateKeyDirectory = async () => {
    setIsLoading(true);
    setLoadingAction("鍵ディレクトリを作成中");
    try {
      const result = await createKeyDirectory();
      if (result.success) {
        setIsKeyDirCreated(true);
        toast.success("鍵ディレクトリが正常に作成されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("鍵ディレクトリの作成に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleRetrieveServerKey = async () => {
    setIsLoading(true);
    setLoadingAction("サーバー鍵を取得中");
    try {
      const result = await retrieveServerKey();
      if (result.success) {
        setIsServerKeyRetrieved(true);
        toast.success("サーバー鍵が正常に取得されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("サーバー鍵の取得に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleGenerateKeyA = async () => {
    setIsLoading(true);
    setLoadingAction("鍵Aを生成中");
    try {
      const result = await generateKey("key_a");
      if (result.success) {
        setIsKeyAGenerated(true);
        toast.success("鍵Aが正常に生成されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("鍵Aの生成に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleGenerateKeyB = async () => {
    setIsLoading(true);
    setLoadingAction("鍵Bを生成中");
    try {
      const result = await generateKey("key_b");
      if (result.success) {
        setIsKeyBGenerated(true);
        toast.success("鍵Bが正常に生成されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("鍵Bの生成に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleEncryptKeyA = async () => {
    setIsLoading(true);
    setLoadingAction("鍵Aを暗号化中");
    try {
      const result = await encryptKeyA();
      if (result.success) {
        setIsKeyAEncrypted(true);
        toast.success("鍵Aが正常に暗号化されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("鍵Aの暗号化に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleSendEncryptedKeyA = async () => {
    setIsLoading(true);
    setLoadingAction("暗号化された鍵Aを送信中");
    try {
      const result = await sendEncryptedKeyA();
      if (result.success) {
        setIsKeyASent(true);
        toast.success("暗号化された鍵Aが正常に送信されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("暗号化された鍵Aの送信に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleSendKeyB = async () => {
    setIsLoading(true);
    setLoadingAction("鍵Bを送信中");
    try {
      const result = await sendPublicKeyB();
      if (result.success) {
        setIsKeyBSent(true);
        toast.success("鍵Bが正常に送信されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("鍵Bの送信に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleDeleteKeyA = async () => {
    setIsLoading(true);
    setLoadingAction("鍵Aを削除中");
    try {
      const result = await deleteKey("key_a");
      if (result.success) {
        setIsKeyAGenerated(false);
        setIsKeyAEncrypted(false);
        setIsKeyASent(false);
        toast.success("鍵Aが正常に削除されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("鍵Aの削除に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleDeleteAllKeys = async () => {
    setIsLoading(true);
    setLoadingAction("すべての鍵を削除中");
    try {
      const result = await deleteAllKeys();
      if (result.success) {
        setIsKeyDirCreated(false);
        setIsServerKeyRetrieved(false);
        setIsKeyAGenerated(false);
        setIsKeyBGenerated(false);
        setIsKeyAEncrypted(false);
        setIsKeyASent(false);
        setIsKeyBSent(false);
        toast.success("すべての鍵が正常に削除されました");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("すべての鍵の削除に失敗しました");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleClearChat = () => {
    onClearChat();
    toast.success("チャット履歴が消去されました");
  };

  return (
    <div className="h-full flex flex-col bg-sidebar rounded-lg overflow-hidden shadow-subtle">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-medium tracking-tight">鍵管理</h2>
        <p className="text-sm text-muted-foreground mt-1">
          セキュア通信のための暗号鍵を管理
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatedContainer delay={0.1}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              環境設定
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleCreateKeyDirectory}
                disabled={isKeyDirCreated || isLoading}
              >
                {isKeyDirCreated ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <FolderPlus className="h-4 w-4 mr-2" />
                )}
                {isLoading && loadingAction === "鍵ディレクトリを作成中" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                鍵ディレクトリを作成
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleRetrieveServerKey}
                disabled={!isKeyDirCreated || isServerKeyRetrieved || isLoading}
              >
                {isServerKeyRetrieved ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isLoading && loadingAction === "サーバー鍵を取得中" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                サーバー鍵を取得
              </Button>
            </div>
          </div>
        </AnimatedContainer>

        <Separator />

        <AnimatedContainer delay={0.2}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              鍵A管理
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleGenerateKeyA}
                disabled={!isServerKeyRetrieved || isKeyAGenerated || isLoading}
              >
                {isKeyAGenerated ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                {isLoading && loadingAction === "鍵Aを生成中" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                鍵Aを生成
              </Button>

              <AnimatePresence>
                {isKeyAGenerated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleEncryptKeyA}
                      disabled={!isKeyAGenerated || isKeyAEncrypted || isLoading}
                    >
                      {isKeyAEncrypted ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Key className="h-4 w-4 mr-2" />
                      )}
                      {isLoading && loadingAction === "鍵Aを暗号化中" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      鍵A（秘密）を暗号化
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleSendEncryptedKeyA}
                      disabled={!isKeyAEncrypted || isKeyASent || isLoading}
                    >
                      {isKeyASent ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {isLoading && loadingAction === "暗号化された鍵Aを送信中" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      暗号化された鍵Aを送信
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleDeleteKeyA}
                      disabled={!isKeyAGenerated || isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isLoading && loadingAction === "鍵Aを削除中" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      鍵A（秘密）を削除
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedContainer>

        <Separator />

        <AnimatedContainer delay={0.3}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              鍵B管理
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleGenerateKeyB}
                disabled={!isServerKeyRetrieved || isKeyBGenerated || isLoading}
              >
                {isKeyBGenerated ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                {isLoading && loadingAction === "鍵Bを生成中" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                鍵Bを生成
              </Button>

              <AnimatePresence>
                {isKeyBGenerated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleSendKeyB}
                      disabled={!isKeyBGenerated || isKeyBSent || isLoading}
                    >
                      {isKeyBSent ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isLoading && loadingAction === "鍵Bを送信中" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      鍵B（公開）をTEEに送信
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedContainer>

        <Separator />

        <AnimatedContainer delay={0.4}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              クリーンアップ
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleDeleteAllKeys}
                disabled={!isKeyDirCreated || isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isLoading && loadingAction === "すべての鍵を削除中" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                すべての鍵を削除
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleClearChat}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                チャット履歴を消去
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {isLoading && (
        <div className="p-4 border-t border-sidebar-border bg-muted/50">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">{loadingAction}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyManagement;
