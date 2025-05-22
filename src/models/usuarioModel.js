let usuarios = [];
let idCounter = 1;

const usuarioModel = {
    listar: () => {
        return usuarios;
    },

    buscarPorId: (id) => {
        return usuarios.find(u => u.id === id);
    },

    criar: (usuario) => {
        const novoUsuario = {
            id: idCounter++,
            nome: usuario.nome,
            email: usuario.email,
        };
        usuarios.push(novoUsuario);
        return novoUsuario;
    },

    atualizar: (id, dados) => {
        const index = usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            usuarios[index] = { id, ...dados };
            return usuarios[index];
        }
        return null;
    },

    deletar: (id) => {
        const existe = usuarios.some(u => u.id === id);
        usuarios = usuarios.filter(u => u.id !== id);
        return existe;
    }
};

module.exports = usuarioModel;
