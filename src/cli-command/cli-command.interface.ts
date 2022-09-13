interface CliCommandInterface {
    readonly name: string;
    execute(...parameters: string[]): Promise<void>;
}

export default CliCommandInterface;
