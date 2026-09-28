import Button from '@/components/ui/button/Button';
import IcPlus from '@/components/ui/icons/IcPlus';

interface AddTodoButtonProps {
  onClick: () => void;
}

/** 할 일 추가 (FN-TD-04). 목표 미선택 상태로 생성 모달을 여는 요청만 올립니다. */
const AddTodoButton = ({ onClick }: AddTodoButtonProps) => {
  return (
    <Button
      variant="neutral"
      size="sm"
      className="w-26 gap-1 md:w-30"
      onClick={onClick}
    >
      <IcPlus className="size-5 shrink-0" />할 일 추가
    </Button>
  );
};

export default AddTodoButton;
