
import React from "react";
import AnimatedContainer from "./AnimatedContainer";
import ProcessingStep from "./ProcessingStep";

interface ProcessingPanelProps {
  currentStep: number;
}

const ProcessingPanel: React.FC<ProcessingPanelProps> = ({ currentStep }) => {
  return (
    <AnimatedContainer className="h-full bg-white rounded-lg border p-4 overflow-y-auto">
      <h3 className="text-sm font-medium mb-3">TEE処理</h3>
      
      <div className="space-y-1">
        <ProcessingStep
          step={1}
          currentStep={currentStep}
          text="鍵A（公開）でプロンプトを暗号化"
          isCompleted={currentStep > 1}
        />
        
        <ProcessingStep
          step={2}
          currentStep={currentStep}
          text="暗号化されたプロンプトをTEEに送信"
          isCompleted={currentStep > 2}
        />
        
        <ProcessingStep
          step={3}
          currentStep={currentStep}
          text="TEE内で鍵A（秘密）を使用してプロンプトを復号化"
          isCompleted={currentStep > 3}
        />
        
        <ProcessingStep
          step={4}
          currentStep={currentStep}
          text="TEE内で応答を生成"
          isCompleted={currentStep > 4}
        />
        
        <ProcessingStep
          step={5}
          currentStep={currentStep}
          text="鍵B（公開）で応答を暗号化"
          isCompleted={currentStep > 5}
        />
        
        <ProcessingStep
          step={6}
          currentStep={currentStep}
          text="鍵B（秘密）で応答を復号化"
          isCompleted={currentStep > 6}
        />
      </div>
    </AnimatedContainer>
  );
};

export default ProcessingPanel;
