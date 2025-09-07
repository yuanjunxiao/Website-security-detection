declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback: (notification: any) => void) => void;
          renderButton: (element: HTMLElement | null, options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'small' | 'medium' | 'large';
            text?: 'signin_with' | 'signup_with' | 'continue_with';
            width?: number;
          }) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export {};
