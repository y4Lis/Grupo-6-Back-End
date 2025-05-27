const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Produtos locais
const produtosLocais = require('./produtos.json');

app.get('/alimento/:codigo', async (req, res) => {
  const codigo = req.params.codigo;

  if (produtosLocais[codigo]) {
    return res.json(produtosLocais[codigo]);
  }

  // Open Food Facts
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
    if (response.data.status === 1) {
      const produto = response.data.product;
      const dados = {
        nome: produto.product_name,
        gordura_saturada: produto.nutriments['saturated-fat'],
        gordura_trans: produto.nutriments['trans-fat'] || 0,
        carboidratos: produto.nutriments.carbohydrates,
        proteina: produto.nutriments.proteins,
        energia_kcal: produto.nutriments.energy
      };
      return res.json(dados);
    } else {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro ao consultar API externa" });
  }
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
